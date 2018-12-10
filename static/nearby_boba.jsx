

class ShopButton extends React.Component {
  render() {
    const name = this.props.name
    //can turn div below into button by using a-tag
    return <div className="shop-button">{ name }</div>
  }
}


class ShopResults extends React.Component {
  constructor(props) {
    super(props);
    console.log("Adding Listener, step 1")
    //initializing the state to have an empty array
    this.state = { shops: [] };
    // Binds event handler, so `this` is accessible inside callback.
    this.handleNewShopEvent = this.handleNewShopEvent.bind(this);

    $(document).on("addBobaShop", this.handleNewShopEvent);
  }


  handleNewShopEvent(e, data){
    console.log("yo, step 3");
    // here we are telling the component that it needs to
    //rerender itself because it has new data
    this.setState({ shops: e.shopList });
  }

  getShopButtons(){
    // this will pull names out of state, curly brackets on left
    // pulls whatever you want out of the state, put functing in
    // h3 div
    const { shops } = this.state;
    return shops.slice(0,10).map(function(shop) {

      //this is how you pass props into a compenent, aka you pass whatever
      //you want into your child component
      return <ShopButton name={shop.name} />
    })
  }


  render() {
    console.log(this.state.names)
    return (
    <div className="shop-results">
      <h1>Nearby:</h1>
      <h3>{ this.getShopButtons() }</h3>
    </div>
    );
  }
}
