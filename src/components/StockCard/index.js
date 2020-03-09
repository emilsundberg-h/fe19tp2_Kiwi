import React from "react";
import usStocksList from "../ApiReader/usStocksList.json";
import styled from "styled-components";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import { NavLink, withRouter, Redirect } from "react-router-dom";
import {
  StockListWrapper,
  StyledStockList,
  StockListItem,
  StockItemMain,
  StockItemData,
  StockItemButton,
  StockItemGain,
  StockSymbol,
  StockDesc,
  StockValue,
  StockValueOwned,
  StockLabel,
  StockCurrency,
  StockValueContainer,
  StockAmountInput
} from "./styles";

class StockCard extends React.Component {
  state = {
    redirect: false,
    amounts: {}
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase
      .user(this.props.uid)
      .child("stocklist")
      .on("value", snapshot => {
        const userObject = snapshot.val();
        this.setState({
          stocklist: userObject,
          loading: false
          /*   storage: localStorage.getItem('data') */
        });
      });
  }
  /*  componentWillUnmount() {
     this.props.firebase.user(this.props.uid).child("stocklist").off();
   } */

  updateUserStocklist = stocklist => {
    if (!stocklist) {
      console.log("Stocklist needed.");
      return;
    }
    this.props.firebase
      .user(this.props.uid)
      .child("stocklist")
      .set(stocklist);
    this.setState({
      stocklist: stocklist
    });
  };

  handleAddStock = newStock => {
    let stockList = this.state.stocklist;
    if (!stockList) {
      console.log("triggered");
      stockList = [];
    }
    if (stockList.some(stock => stock.symbol === newStock.symbol)) {
    } else {
      const newStockList = stockList;
      newStockList.push(newStock);
      this.updateUserStocklist(newStockList);
    }
  };

  handleRemoveStock = oldStock => {
    const newStockList = this.state.stocklist.filter(
      stock => stock.symbol !== oldStock.symbol
    );
    this.updateUserStocklist(newStockList);
  };

  newStockValues = symbol =>
    this.props.masterObject && !this.state.loading ? (
      this.props.masterObject[symbol] ? (
        this.props.masterObject[symbol].quoteUrl.c.toFixed(2)
      ) : (
        <div style={{ transform: "translateY(-8px)" }}>
          <i className="fas fa-spinner fa-spin fa-xs"></i>
        </div>
      )
    ) : (
      <div style={{ transform: "translateY(-8px)" }}>
        <i className="fas fa-spinner fa-spin fa-xs"></i>
      </div>
    );

  selectedStock = e => {
    if (
      e.target.tagName !== "BUTTON" &&
      e.target.tagName !== "I" &&
      e.target.tagName !== "INPUT"
    ) {
      console.log(e.target.closest("li").id);
      this.setState({
        stockData: this.props.masterObject[e.target.closest("li").id].quoteUrl,
        redirect: true
      });
    } else {
      console.log("failed");
    }
  };

  changeMultiplier = (e, symbol) => {
    console.log("chgMult");
    const { stocklist } = this.state;
    let stockToChange = stocklist.find(stock => stock.symbol === symbol);
    stockToChange.amount = e.target.value;
    //console.log(stocklist)
    this.updateUserStocklist(stocklist);
    //let amount = this.state.amounts; // []
    //amount[symbol] = e.target.value; // {AAPL: 56}
    //this.setState({ amounts: amount })
  };

  render() {
    return (
      <StockListWrapper>
        <StyledStockList>
          {this.state.stocklist &&
            this.state.stocklist.map((stock, index) =>
              this.state.redirect ? (
                <Redirect to="/stockpage" stock={this.state.stockData} />
              ) : (
                <StockListItem
                  id={stock.symbol}
                  key={"o" + index}
                  onClick={this.selectedStock}
                >
                  <StockItemMain>
                    <StockItemData>
                      <StockSymbol>{stock.symbol}</StockSymbol>
                      <StockDesc>{stock.description}</StockDesc>
                      <StockLabel>Owned stocks worth:</StockLabel>
                      <StockValueOwned>
                        <StockCurrency>$</StockCurrency>
                        {(
                          this.newStockValues(stock.symbol) *
                          (stock.amount ? stock.amount : 1)
                        ).toFixed(2) || "No data"}
                      </StockValueOwned>
                      <StockValueContainer>
                        <div>
                          <StockLabel>Current stock value:</StockLabel>
                          <StockValue>
                            {this.newStockValues(stock.symbol) || "No data"}
                          </StockValue>
                        </div>
                        <div>
                          <StockLabel>Add more</StockLabel>
                          <StockAmountInput
                            type="number"
                            name={stock.symbol}
                            onChange={e =>
                              this.changeMultiplier(e, stock.symbol)
                            }
                            value={stock.amount ? stock.amount : "1"}
                          />
                        </div>
                      </StockValueContainer>
                    </StockItemData>
                    <StockItemButton>
                      <AddDeleteButton
                        onClick={e => this.handleRemoveStock(stock)}
                        primary
                      >
                        <i className="fas fa-trash-alt"></i>
                      </AddDeleteButton>
                    </StockItemButton>
                    <StockItemGain></StockItemGain>
                  </StockItemMain>
                </StockListItem>
              )
            )}
        </StyledStockList>
      </StockListWrapper>
    );
  }
}

const AddDeleteText = styled.span`
  color: #fff;
`;

const MyStocklist = styled.div`
  width: 320px;
  height: 140px;

  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin: 20px;

  display: inline-grid;
  grid-template-columns: 20px 215px 30px 35px 20px;
  grid-template-rows: 15px 3px 22px 15px 15px 50px 20px;
  &:hover {
    transform: scale(1.03);
    transition: transform 0.3s;
  }
`;

const UpDownView = styled.div`
  width: 320px;
  height: 20px;

  background-color: #8bc34a;
  border: 0;
  box-sizing: border-box;

  border-radius: 0px 0px 10px 10px;
  margin: 0px;
  grid-column: 1;
  grid-row: 7 / 7;
`;

const AddDeleteButton = styled.button`
  width: ${props => (props.primary ? "35px" : "65px")};
  height: 32px;
  font-size: 15px;
  color: #fff;
  border: 0;
  border-radius: 10px;
  margin-bottom: 47px;
  background-color: ${props => (props.primary ? "#E53935" : "#8BC34A")};

  grid-column: ${props => (props.primary ? "4" : "3 /4")};
  grid-row: 2;

  cursor: pointer;

  :hover {
    transform: scale(1.1);
    transition: transform 0.3s;
  }
  :focus {
    outline: 0;
  }
`;

export default withFirebase(StockCard);
