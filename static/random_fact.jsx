

var facts =["Most Boba is gluten free. The tapioca balls that sit at the bottom of the cup are made out of cassava starch, a woody shrub native to South America.",
"Many boba stores allow you to choose the level of sweetness for your drink. If you don’t have much of a sweet tooth try, asking for your drink 50% sweet.",
"The “Boba Teashake” was the most expensive boba drink to date. Designed by Tealeaves, it was available for limited release only once in San Francisco on June 22, 2017 for a ticket price of $45.",
"There is an average of 380 new boba tea shops opening each year since boba hit the food scene in 1988. Maybe its time to open your own shop?",
"If you’re eco-conscious, many online retailers sell reusable boba straws. They can be made from metal or silicone and often come with a nifty carrying case and cleaning-brush.",
"A popular fastfood chain from the Philippines carries boba drinks. If you go to Jolliebees, ask for their Ube Pearl cooler; sure to quench any adventurous boba lover’s craving.",
"Not a fan of tapioca? You can opt out of it all together or try other nifty things like pudding, basil seeds, jelly, or fruit.",
"Boba tea can be a great base for cocktails. Popular chain “Kung-Fu” would agree. They wrote a whole blog post on what drinks pair well with certain alcohols.",
"A boba by any name is just as sweet. Some shops refer to this drink as: tapioca milk-tea, bubble tea, and pearl milk-tea."];

let randomFact = facts[Math.floor(Math.random()*facts.length)];
let fact = randomFact.content;

class RandFact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fact: randomFact
    }
    this.getClicked = this.getClicked.bind(this);
  }

getClicked() {
  let newRandomFact = facts[Math.floor(Math.random()*facts.length)];
  this.setState({fact: newRandomFact});
}
  render() {
    let fact = this.state.fact
    return(
      <div className="bfacts text-center">
        <h1>Boba Facts</h1>
         <h3>{ fact }</h3>
        <button type="button" className="btn btn-primary" onClick={this.getClicked}>
          More Boba Facts!
        </button>
      </div>
    );
  }
}
