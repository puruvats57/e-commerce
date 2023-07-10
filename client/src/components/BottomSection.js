import React from 'react';

function BottomSection({ pay, total, pa }) {
  return (
    <div className='bottom'>
      {pay.map((item) => (
        <h5 key={item._id}>
          {item.name} ({item.price}), quantity-{item.quantity}
        </h5>
      ))}
      <h3>Total price: {total}</h3>
      <button className='paybutton' onClick={pa}>Pay now</button>
    </div>
  );
}

export default BottomSection;
