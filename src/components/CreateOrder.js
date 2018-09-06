import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
// 
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
//
import Button from '@material-ui/core/Button'
import { inject, observer } from 'mobx-react'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
})

@inject('CreateOrderStore')
@observer
class CreateOrder extends React.Component {
  render() {
    const {CreateOrderStore, classes, type} = this.props
    return (
      <div>
        <style jsx="true">{`
            .header {
              background: #bebebe;
              width: 100%;
              display: block;
            }
        `}</style>
        <div class="header">{type}</div>
        <form className={classes.container} noValidate autoComplete="off" onSubmit={console.log('submit')}>
          <TextField
            id="price"
            label="Price"
            className={classes.textField}
            value={CreateOrderStore[type].price}
            onChange={console.log('changed')}
            margin="normal"
          />
          <TextField
            id="amount"
            label="Amount"
            className={classes.textField}
            value={CreateOrderStore[type].amount}
            onChange={console.log('changed')}
            margin="normal"
          />
          <TextField
            id="minAmount"
            label="Min amount of each order"
            className={classes.textField}
            value={CreateOrderStore[type].minAmount}
            onChange={console.log('changed')}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={CreateOrderStore[type].unencumbered}
                onChange={console.log('changed')}
                value="checkedBalance"
                color="primary"
              />
            }
            label="Place order on unencumbered balance"
          />
          <Button variant="contained" color="primary" className={classes.button} fullWidth="true" type="submit">Sell</Button>
          <ul>
            <li>{CreateOrderStore[type].result}</li>
            <li>{CreateOrderStore[type].orders}</li>
            <li>{CreateOrderStore[type].rebateAddress}</li>
          </ul>
        </form>
      </div>
    )
  }

  // async sellAll(event) {
  //   event.preventDefault()
  //   var web3 = this.props.web3
  //   var amount = web3.utils.toWei(this.state.amount)
  //   var minAmount = web3.utils.toWei(this.state.minAmount)
  //   var price = web3.utils.toWei(this.state.price)
  //   // TODO Миша: продублировать min_amount
  //   // TODO Миша: переменная, что делать с остатком
  //   this.setState({
  //     orders: this.findBidOrders(this.state.amount, this.state.price, this.state.minAmount)
  //   })
  //   // TODO Миша: sellall и willby правила написания
  //   this.setState({
  //     result: await this.bursa.methods.sellAll(amount, this.props.tokenAddress, price, this.state.orders, this.props.rebateAddress).send({from: this.props.wallet})
  //   })
  // }
}

CreateOrder.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CreateOrder)