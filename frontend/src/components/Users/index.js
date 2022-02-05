import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import axios from 'axios'
import Delete from '@mui/icons-material/Delete'
import moment from 'moment'
import Loader from '../Loader'
import { SnackBarContext } from '../Snackbar'
import { jwtManager } from '../../helper/jwtManager'
import { useNavigate } from 'react-router-dom'

const Users = () => {
  const { showMsg } = useContext(SnackBarContext)
  const navigate = useNavigate()
  let [laoding, setLoading] = useState(false)
  let [data, setData] = useState(null)
  useEffect(async () => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      let { data } = await axios.get('/admin/all-users')
      if (data.success) setData(data.data)
      else showMsg(data)
    } catch (e) {
      showMsg({ status: 'error', message: 'Oops! something went wrong!' })
    }
    setLoading(false)
  }

  const deleteUser = async (id) => {
    try {
      let { data } = await axios.delete(`/admin/${id}`)
      setLoading(false)
      showMsg(data)
      if (data.success) fetchUsers()
    } catch (e) {
      showMsg({ status: 'error', message: 'Oops! something went wrong!' })
      setLoading(false)
    }
  }

  return (
    <div style={{ height: 400, width: '80%', marginTop: 8, padding: 48 }}>
      {laoding && <Loader />}
      <DataGrid
        columns={[
          {
            field: 'createdAt',
            headerName: 'Creation Date',
            width: 280,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => moment(params.value).format('llll'),
          },
          {
            field: 'username',
            headerName: 'User Name',
            width: 300,
            align: 'center',
            headerAlign: 'center',
          },
          {
            field: 'type',
            headerName: 'User Type',
            width: 280,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
              let user = params.value
              return `${user.charAt(0).toLocaleUpperCase()}${user.slice(1)}`
            },
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 80,
            getActions: (params) => {
              if (params.id === jwtManager.getUser()._id)
                return [<span style={{ color: 'blue' }}>You</span>]
              return [
                <GridActionsCellItem
                  icon={<Delete />}
                  label='Delete'
                  onClick={() => deleteUser(params.id)}
                />,
              ]
            },
          },
        ]}
        rows={data || []}
        getRowId={(row) => row._id}
      />
    </div>
  )
}

export default Users
