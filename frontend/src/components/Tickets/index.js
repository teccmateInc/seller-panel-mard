import React, { useContext, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import moment from 'moment'
import Loader from '../Loader'
import { SnackBarContext } from '../Snackbar'
import { jwtManager } from '../../helper/jwtManager'
import { Badge, Button, Grid, MenuItem, Select, Typography } from '@mui/material'
import Create from './Create'
import NoData from '../NoData'

const Tickets = () => {
  const { showMsg } = useContext(SnackBarContext)
  const [openTicketModal, setTicketModal] = useState(false)
  const [createNew, setNew] = useState(false)
  const [tid, setTid] = useState(null)
  const [unReadCount, setUnReadCount] = useState(0)
  const [ticketsMsgs, setTicketsMsgs] = useState([])
  let [loading, setLoading] = useState(false)
  let [data, setData] = useState(null)
  let user = jwtManager.getUser()
  useEffect(async () => {
    fetchData()
  }, [])

  const countUnReadMsg = (data) => {
    if (data && data.length > 0) {
      let msgCount = 0
      data.forEach(({ unread, messages, lastmsgby }) => {
        if (unread && lastmsgby !== user._id) ++msgCount
      })
      if (msgCount !== unReadCount) setUnReadCount(msgCount)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = user.type === 'admin' ? 'ticket/all-tickets' : 'ticket'
      let { data } = await axios.get(url)
      // console.log(data)
      if (data.success) {
        if (openTicketModal && !createNew) {
          countUnReadMsg(data.data)
          ticketDetails({ row: { _id: tid } }, null, data.data)
        }
        countUnReadMsg(data.data)
        setData(data.data)
      }
      else showMsg(data)
      setLoading(false)
    } catch (e) {
      showMsg({ status: 'error', message: 'Oops! something went wrong!' })
      setLoading(false)
    }
  }

  const updateStatus = async (tid, status) => {
    setLoading(true)
    try {
      let { data } = await axios.put('ticket/update-ticket-status', {
        tid,
        status,
      })
      showMsg(data)
      if (data.success) fetchData()
    } catch (e) {
      showMsg({ status: 'error', message: 'Oops! something went wrong!' })
    }
    setLoading(false)
  }

  const updateMsgStatus = async (tid) => {
    setLoading(true)
    try {
      let { data } = await axios.put('ticket/update-unreadmsg-status', {
        tid
      })
      !data.success && showMsg(data)
      if (data.success) fetchData()
    } catch (e) {
      showMsg({ status: 'error', message: 'Oops! something went wrong!' })
    }
    setLoading(false)
  }

  const sendMsg = async (msg) => {
    if (msg.trim() === '') return showMsg({ status: 'info', message: 'Message is required!' })
    else {
      // console.log(tid, 'senderId', user._id, msg)
      const obj = {
        text: msg,
        senderId: user._id,
        tid: tid
      }
      setLoading(true)
      try {
        let { data } = await axios.put('ticket/send-msg', obj)
        showMsg(data)
        if (data.success) fetchData()
      } catch (e) {
        showMsg({ status: 'error', message: 'Oops! something went wrong!' })
      }
      setLoading(false)
    }
  }

  const createTicket = async (msg) => {
    if (msg.trim() === '') return showMsg({ status: 'info', message: 'Message is required!' })
    else {
      const obj = {
        text: msg,
        senderId: user._id,
      }
      setLoading(true)
      try {
        let { data } = await axios.post('ticket/create-ticket', obj)
        setLoading(false)
        showMsg(data)
        if (data.success) {
          setTicketModal(false)
          setNew(false)
          fetchData()
        }
      } catch (e) {
        setLoading(false)
        showMsg({ status: 'error', message: 'Oops! something went wrong!' })
      }
    }
  }

  const ticketDetails = (params, type, updatedData = null) => {
    if (type === 'new') {
      setNew(true)
      setTicketModal(true)
    }
    else {
      let t_data = Array.isArray(updatedData) ? updatedData : data
      // console.log(t_data)
      let d = t_data.filter(d => d._id === params.row._id)
      setTicketsMsgs(d[0])
      setTid(params.row._id)
      setTicketModal(true)
      if (params.row.unread && params.row.lastmsgby !== user._id) updateMsgStatus(params.row._id)
    }
  }

  return (
    <div style={{ height: 400, marginTop: 8, padding: 48, textAlign: 'end', width: user.type === 'admin' ? '83%' : '65%' }}>
      {loading && <Loader />}
      {openTicketModal &&
        <Create
          onClose={() => setTicketModal(false)}
          tid={tid}
          sendMsg={sendMsg}
          updateStatus={updateStatus}
          data={!createNew && ticketsMsgs}
          userType={user.type}
          createNew={createNew}
          createTicket={createTicket}
          userId={user._id}
        />}
      <Grid display='flex' justifyContent='space-between'>
        <Badge color="primary" badgeContent={unReadCount} max={999}>
          <Typography sx={{ background: '#ecf4ff', p: 1 }}>{unReadCount ? 'Un Read' : 'No New Message'}</Typography>
        </Badge>
        {user.type !== 'admin' && <Button variant='contained' onClick={() => ticketDetails(null, 'new')}>Create New Ticket</Button>}
      </Grid>
      <DataGrid
        sx={{ mt: 2 }}
        columns={[
          {
            field: 'messages',
            headerName: 'Ticket',
            width: 300,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
              let r = params.row
              let msgs = r?.messages
              if (msgs && msgs.length > 0) {
                if (r.unread && r.lastmsgby !== user._id) {
                  return <Badge color="error" badgeContent={' '} variant="dot">
                    <Typography noWrap>
                      {msgs[0].text}
                    </Typography>
                  </Badge>
                }
                return <Typography noWrap>{msgs[0].text}</Typography>
              }
              else return ''
            },
          },
          {
            field: 'user',
            headerName: 'Created By',
            width: 280,
            align: 'center',
            headerAlign: 'center',
            hide: user.type !== 'admin',
            renderCell: (params) => {
              return <>{params.row?.user?.username ?? ''}</>
            }
          },
          {
            field: 'createdAt',
            headerName: 'Date',
            width: 280,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => moment(params.value).format('llll'),
          },
          {
            field: 'status',
            headerName: 'Status',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
              if (user.type === 'admin') {
                return (
                  <Select
                    id='status'
                    value={params.value}
                    onChange={(e) => {
                      if (e.target.value === params.value)
                        showMsg({ status: 'info', message: 'Already updated!' })
                      updateStatus(params.id, e.target.value)
                    }}
                  >
                    <MenuItem value='in review'>In Review</MenuItem>
                    <MenuItem value='open'>Open</MenuItem>
                    <MenuItem value='close'>Close</MenuItem>
                  </Select>
                )
              } else return params.value
            },
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 180,
            getActions: (params) => {
              if (params.id)
                return [
                  <Button variant='contained'>
                    Add Message
                  </Button>
                ]
            },
          },
        ]}
        rows={data || []}
        getRowId={(row) => row._id}
        onRowClick={ticketDetails}
        getRowClassName={() => 'cursor-pointer'}
        components={{ NoRowsOverlay: () => <NoData title='No Ticket created yet!' loading={loading} /> }}
      />
    </div>
  )
}

export default Tickets
