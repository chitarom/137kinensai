import React from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import data from '../JSON/ProjectData.json'
import Ticket from './Ticket.jsx'

function TicketList ({keyword,filter}) {
  var tickets = [];
  for (let i=0;i<data.length;i++)
    tickets.push(<Ticket keyword={keyword} filter={filter} projdata={data[i]} key={uuidv4()} />);
  return tickets;
}

export default TicketList;
