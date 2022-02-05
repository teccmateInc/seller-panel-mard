import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import ChangePassword from '../changePassword'
import CreateUser from '../createUser'
import Header from '../header'
import Payout from '../payout'
import Tickets from '../Tickets'
import Users from '../Users'
import MainPage from './MainPage'

const Main = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='payout' element={<Payout />} />
        <Route path='change-password' element={<ChangePassword />} />
        <Route path='support-ticket' element={<Tickets />} />
        <Route path='create-user' element={<CreateUser />} />
        <Route path='all-users' element={<Users />} />
        <Route path='/' element={<MainPage />} />
        {/* <Route path='*' element={<ChangePassword />} /> */}
      </Routes>
      <Outlet />
    </>
  )
}

export default Main
