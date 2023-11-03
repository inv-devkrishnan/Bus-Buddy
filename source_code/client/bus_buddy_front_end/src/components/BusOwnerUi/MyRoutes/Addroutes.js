import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { axiosApi } from '../../../utils/axiosApi';
import AddRouteCard from '../../AddRouteCard';

export default function Addbus() {
    const user=useState(1);
  return (
            <div style={{display:"flex",justifyContent:"right",marginRight:'5rem',paddingTop:'5rem' }}>
            <AddRouteCard/>
    </div>
  )
}
