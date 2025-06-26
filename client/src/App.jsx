import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup' 
import Header from './components/Header'
import Project from './pages/Project'
import FooterComp from './components/Footer'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import PostCreate from './pages/PostCreate'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/Projects" element={<Project />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/search" element={<Search />} />
      <Route element={<PrivateRoute/>}>
        <Route path="/Dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<OnlyAdminPrivateRoute/>}>
        <Route path="/create-post" element={<PostCreate />} />
        <Route path="/update-post/:postId" element={<UpdatePost />} />
      </Route>
      <Route path="/Project" element={<Project />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/post/:postSlug" element={<PostPage />} />
    </Routes>
    <FooterComp />
    </BrowserRouter>
  )
}
