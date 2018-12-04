

class ShopResults extends React.Component {
  constructor(props) {
    super(props);
    console.log("Adding Listener, step 1")

    // Bind event handler, so `this` is accessible inside callback.
    this.handleNewShopEvent = this.handleNewShopEvent.bind(this);

    $(document).on("addBobaShop", this.handleNewShopEvent);
  }

  // componentDidMount() {
  //   $(document).on("addBobaShop", this.handleNewBobaShop);
  // }
 // e stands for event

  handleNewShopEvent(e, data){
    console.log("yo, step 3")
    console.log(e.shopData)
    this.setState({ name: e.shopData.name})
  }

  render() {
    return <div className="shop-results">Boba Shops:</div>;
  }
}
