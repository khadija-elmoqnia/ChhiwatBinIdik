import React, { useState, useEffect } from 'react';
import { getNumberOfClients, getUsersByRole, calculerProfit, calculerNombreTotalDeCommandes } from '../../services/firebaseservice';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import "./widget.scss";

const Widget = ({ type, userId = null }) => {
  const [data, setData] = useState({
    title: "Unknown",
    isMoney: false,
    link: "No link available",
    icon: null,
    amount: 1,
    diff: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      switch (type) {
        case "commandes":
          try {
            const commandes = await calculerNombreTotalDeCommandes(userId);
            setData({
              title: "Commandes",
              isMoney: false,
              icon: (
                <ShoppingCartOutlinedIcon
                  className="icon"
                  style={{
                    color: "crimson",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                  }}
                />
              ),
              amount: commandes,
              diff: 0
            });
          } catch (error) {
            console.error('Erreur lors de la récupération du nombre de commandes:', error);
          }
          break;
        case "chefs":
          try {
            const chefs = await getUsersByRole('fournisseur');
            setData({
              title: "Chefs",
              isMoney: false,
              icon: (
                <PersonOutlinedIcon
                  className="icon"
                  style={{
                    color: "crimson",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                  }}
                />
              ),
              amount: chefs.length,
              diff: 0
            });
          } catch (error) {
            console.error('Erreur lors de la récupération du nombre de chefs:', error);
          }
          break;
        case "profit":
          try {
            const profit = await calculerProfit(userId);
            setData({
              title: "Profit",
              isMoney: true,
              icon: (
                <MonetizationOnOutlinedIcon
                  className="icon"
                  style={{
                    backgroundColor: "rgba(0, 128, 0, 0.2)",
                    color: "green",
                  }}
                />
              ),
              amount: profit,
              diff: 0
            });
          } catch (error) {
            console.error('Erreur lors de la récupération du profit:', error);
          }
          break;
        case "clients":
          try {
            const numberOfClients = await getNumberOfClients();
            setData({
              title: "Clients",
              isMoney: false,
              icon: (
                <PersonOutlinedIcon
                  className="icon"
                  style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
                />
              ),
              amount: numberOfClients,
              diff: 0
            });
          } catch (error) {
            console.error('Erreur lors de la récupération du nombre de clients:', error);
          }
          break;
        default:
          break;
      }
    };

    fetchData();
  }, [type]);

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.amount}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {data.diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
