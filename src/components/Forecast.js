import React from "react";
import Card from "react-bootstrap/Card";

export const weatherForecast = ({ min, max, description }) => {
    
    return(
        <Card style={{ width: "18rem" }}>
    <Card.Body>
      <Card.Title>Card Title</Card.Title>
      <Card.Text>

        <div>
            <div>Description: {description}</div>
            <div>Temperature: {min} / {max}</div>
        </div>
    )
    </Card.Text>
    </Card.Body>
  </Card>
);
};
export default weatherForecast;

