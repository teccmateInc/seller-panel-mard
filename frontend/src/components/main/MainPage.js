import React, { useContext, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import moment from 'moment'
import Loader from '../Loader'
import { SnackBarContext } from '../Snackbar'
import { jwtManager } from '../../helper/jwtManager'
import { MenuItem, Select } from '@mui/material'

const MainPage = () => {
  const { showMsg } = useContext(SnackBarContext)
  let [laoding, setLoading] = useState(false)
  let [data, setData] = useState(null)
  let user = jwtManager.getUser()
  useEffect(async () => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = user.type === 'admin' ? '/admin/all-payments' : '/pay'
      let { data } = await axios.get(url)
      if (data.success) setData(data.data)
      else showMsg(data)
    } catch (e) {
      showMsg({ status: 'error', message: 'Oops! something went wrong!' })
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    setLoading(true)
    try {
      let { data } = await axios.put('/admin/update-payment-status', {
        id,
        status,
      })
      showMsg(data)
      if (data.success) fetchData()
    } catch (e) {
      showMsg({ status: 'error', message: 'Oops! something went wrong!' })
    }
    setLoading(false)
  }

  return (
    <div style={{ height: 400, width: '80%', marginTop: 8, padding: 48 }}>
      {laoding && <Loader />}
      <DataGrid
        columns={[
          {
            field: 'createdAt',
            headerName: 'Payment Date',
            width: 280,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => moment(params.value).format('llll'),
          },
          {
            field: 'btcaddress',
            headerName: 'BTC Address',
            width: 300,
            align: 'center',
            headerAlign: 'center',
          },
          {
            field: 'amount',
            headerName: 'Amount',
            width: 280,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
              if (params.row.payment_type === 'custom') return params.value
              else return params.row.payment_type
            },
          },
          {
            field: 'status',
            headerName: 'Status',
            width: 280,
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
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='done'>Done</MenuItem>
                  </Select>
                )
              } else return params.value
            },
          },
        ]}
        rows={data || []}
        getRowId={(row) => row._id}
      />
    </div>
  )
}

export default MainPage
