'use client'
import './globals.css'
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/ui/header";
import MoviePage from "@/components/MoviePage/MoviePage";

const Home = () => {
  return (
      <div className="flex h-screen">
          <Sidebar/>
          <div className="flex-1 flex flex-col">
              <Header />
              <MoviePage />
          </div>
      </div>
  )
};

export default Home;
