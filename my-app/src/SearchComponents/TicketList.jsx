import React from 'react'
import data from '../JSON/ProjectData.json'
import Ticket from './Ticket.jsx'

function TicketList () {
  return data.map((projdata) => <Ticket projdata={projdata} key={projdata[0]} />);
}

export default TicketList;
