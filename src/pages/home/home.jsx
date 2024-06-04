import React from 'react';
import Navbar from '../../components/navbar/navbar';
import Sidebar from '../../components/sidebar/sidebar';
import Featured from '../../components/featured/featured';
import Widget from '../../components/widget/widget';
import AnalyticsDashboard from '../../components/Analytics/analytics';
import "./home.scss";

const Home = () => {
 
  const email = localStorage.getItem('adminEmail');


  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar email={email} />
        <div className='charts'>
          <AnalyticsDashboard /> 
        </div>
        <div className='widgets'>
          <Widget type="chefs" />
          <Widget type="profit"userId={null} />
          <Widget type="clients" />
          <Widget type="commandes" />
          
        </div>
        <Featured />
      </div>
    </div>
  );
};

export default Home;
