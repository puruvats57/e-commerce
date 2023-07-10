import React from 'react'

function Pay() {
  return (
      <>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous"></link>
          <div class="row my-5">
      <div class="col-md-4 offset-md-4">
        <div class="card">
          <div class="card-body">
            <form action="${process.env.BACKEND_LIVE_URL}/pay" method="POST">
              <div class="form-group">
                <label for="">Name: </label>
                <input class="form-control" type="text" name="name" />
              </div>
              <div class="form-group">
                <label for="">Email: </label>
                <input class="form-control" type="text" name="email" />
              </div>
              <div class="form-group">
                <label for="">Phone: </label>
                <input class="form-control" type="text" name="phone" />
              </div>
                <div class="form-group">
                <label for="">Amount: </label>
                <input class="form-control" type="text" name="amount" />
              </div>
              <div class="form-group">
                <button class="btn form-control btn-primary">Pay Now</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
      </>
  )
}

export default Pay