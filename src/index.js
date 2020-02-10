import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import Pagination from './components/Pagination';
import './index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link, NavLink
} from "react-router-dom";
import axios from 'axios';


function f(name) {
    return name.title;
}

const name = {
    title: 'Tour of Heroes',
};

const HEROES = [
    {id: 11, name: 'Dr Nice'},
    {id: 12, name: 'Narco'},
    {id: 13, name: 'Bombasto'},
    {id: 14, name: 'Celeritas'},
    {id: 15, name: 'Magneta'},
    {id: 16, name: 'RubberMan'},
    {id: 17, name: 'Dynama'},
    {id: 18, name: 'Dr IQ'},
    {id: 19, name: 'Magma'},
    {id: 20, name: 'Tornado'}
]



class HeroesList extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            heroes: [],
            selectedHero: null,
            listmessages: 'HeroService: fetched heroes',
            newHero: '',
            currentPage:1,
            heroesPerPage:5
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    getHeroes() {
        axios.get(` http://localhost:3004/heroes`)
            .then(res => {
                const heroes = res.data;
                this.setState({heroes:heroes});
            }).catch(error => console.log(error))
            .then(() => console
                .log("GET executed"))
    }

    componentDidMount() {
        this.getHeroes();
    }


    render() {
        const {heroes,currentPage,heroesPerPage}=this.state;

        const indexOfLastHero=currentPage*heroesPerPage;
        const indexOfFirstHero=indexOfLastHero-heroesPerPage;
        const currentHeroes=heroes.slice(indexOfFirstHero,indexOfLastHero);

        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(heroes.length / heroesPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    {number}
                </li>
            );
        });

        return (
            <div>
                <h2>My Heroes</h2>
                <div>
                    <label>Hero name:
                        <input type="text" value={this.state.newHero} onChange={this.handleChange} placeholder={"Enter name"}/>
                    </label>
                    <div>
                        <button onClick={() => this.addHero(this.state.newHero)}>ADD</button>
                    </div>
                <div>
                    <ul className="heroes">
                        {
                            currentHeroes.map((hero) =>
                                <li key={hero.id} onClick={() => this.selectHero(hero)}>
                                    <Link key={hero.id} to={`/detail/${hero.id}/${hero.name}`}><span  className="badge">{hero.id}
                                </span>{hero.name}
                                    </Link>
                                    <button className="delete" title="delete hero" onClick={() => this.deleteHero(hero)}>x
                                    </button>
                                </li>

                            )}
                    </ul>
                    {renderPageNumbers}
                </div>
                </div>
                {this.state.listmessages && <div>
                    {<MessageService messag={this.state.listmessages}/>}
                    <button className="clear" onClick={() => this.clear(this.state.listmessages)}>Clear</button>
                </div>}
            </div>
        );
    }

    paginate(number) {
        this.setState({
            currentPage:number
            }
        )
    }

    handleChange = (e) => {
        this.setState({newHero: e.target.value});
    }

    addHero(newHero) {
        axios.post(`http://localhost:3004/heroes`, {
            name: newHero
        })
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(() => this.getHeroes())
        this.state.newHero = ''
    }

    deleteHero(hero) {
        axios.delete(`http://localhost:3004/heroes/${hero.id}`)
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(() => this.getHeroes())
    }

    clear() {
        this.setState({listmessages: null})
    }

    selectHero(hero) {
        this.setState({selectedHero: hero})
        this.setState({selected: true})
    }
}

class Tittle extends React.Component {
    render() {
        return f(name);
    }
}

class SelectedHero extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: this.props.match.params.name,
            id: Number.parseInt(this.props.match.params.id)
        }
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div>
                <h2>{this.state.text} Details</h2>
                <div><span className="badge">id:</span>{this.state.id}</div>
                <div><label>Name: <input type="text" value={this.state.text} onChange={this.handleChange}/></label>
                </div>
                <div>
                    <Link onClick={() => {this.updateHero(this.state.id, this.state.text); this.props.history.goBack()}}>Save</Link>
                    <Link onClick={() => this.props.history.goBack()}>Back</Link>
                </div>
            </div>
        )
    }

    updateHero(id, text) {
        const hero = HEROES.find(h => h.id === id);
        hero.name = text;
        axios.put(`http://localhost:3004/heroes/${hero.id}`, {
            id: hero.id,
            name: hero.name
        }).then(r => {
            console.log(r);
            console.log(r.data);
        })

    }

    handleChange = (e) => {
        this.setState({text: e.target.value});
    }
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heroes: [],
            searchHero: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    getHeroes() {
        axios.get(` http://localhost:3004/heroes`)
            .then(res => {
                const heroes = res.data;
                this.setState({heroes});
            }).catch(error => console.log(error))
            .then(() => console
                .log("GET executed"))
    }

    componentDidMount() {
        this.getHeroes();
    }

    render() {
        let _heroes=this.state.heroes;
        let search=this.state.searchHero.trim().toLowerCase();

        if(search.length>0){
            _heroes=_heroes.filter(function (hero) {
                return hero.name.toLowerCase().match(search);
            });
        }else {
            _heroes=[];
        }
        return (
            <div>
                <h3>Top heroes</h3>
                <div className="grid grid-pad">
                    {this.state.heroes.slice(1, 6).map((hero) =>
                        <a key={hero.id} className="col-1-4">
                            <div className="module hero">
                                <NavLink to={`/detail/${hero.id}/${hero.name}`}><h4>{hero.name}</h4></NavLink>
                            </div>
                        </a>
                    )}
                </div>
                <h4>Hero Search</h4>
                <input type="text" value={this.state.searchHero} onChange={this.handleChange}
                       placeholder="Search"></input>
                <ul className="search-result">
                    {_heroes.map((hero) =>
                        <Link key={hero.id} to={`/detail/${hero.id}/${hero.name}`}>
                            <li>{hero.name}</li>
                        </Link>
                    )
                    }
                </ul>
            </div>
        );
    }

    handleChange = (e) => {
        this.setState({searchHero: e.target.value});
    }
}

class Hero extends React.Component {
    constructor(props) {
        super(props);
    }

    renderTittle() {
        return <Tittle/>;
    }

    render() {
        return (
            <div>
                <h1>{this.renderTittle()}</h1>
                <Router>
                    <Link to={"/dashboard"}>Dashboard</Link>
                    <Link to={"/heroes"}>Heroes</Link>
                    <Switch>
                        <Route exac path={"/dashboard"}>
                            <Dashboard/>
                        </Route>
                        <Route exac path={"/heroes"}>
                            <HeroesList/>
                        </Route>
                        <Route path={"/detail/:id/:name"} component={SelectedHero}/>
                    </Switch>
                </Router>
            </div>
        )
    }
}


class MessageService extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const spis = (
            <div>
                <h2>Messages</h2>
                {this.props.messag}
            </div>
        );
        return (
            <div>
                {spis}
            </div>
        );
    }
}

ReactDOM.render(
    <Hero/>,
    document.getElementById('root')
);