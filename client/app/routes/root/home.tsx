// Step 1 - home.tsx file is created

import React from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import type { Route } from './+types/home';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "TaskMaster" },
    { name: "description", content: "Welcome to TaskMaster!" },
  ];
}


const Home = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-4">
      <Link to="/sign-in">
        <Button className="bg-blue-500 text-white">Login</Button>
        
      </Link>
      <Link to="/sign-up">
        <Button variant="outline" className="bg-blue-500 text-white">
          Sign Up
        </Button>
      </Link>
    </div>
  )
}

export default Home