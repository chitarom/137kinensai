import React from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import data from '../JSON/ProjectData.json'
import Ticket from './Ticket.jsx'

function TicketList ({keyword,filter,ddetail,setDDC}) {
  var tickets = [];
  for (let i=0;i<data.length;i++)
    tickets.push(<Ticket keyword={keyword} filter={filter} projdata={data[i]} ddetail={ddetail} setDDC={setDDC} id={i} key={uuidv4()} />);
  return tickets;
}

export default TicketList;
