import React from 'react';
import warrantyAPI from '../../api/warrantyAPI';
import Warranty from '../../components/Warranty/Warranty';
import './WarrantyContainer.css'
import AddWarrantyModal from '../../components/AddWarrantyModal/AddWarrantyModal';
import myState from '../../utils/myState';

export default class WarrantyContainer extends React.Component {
    state = {
        warranties : [],
        addWarrantyStatus: false,
    }

    componentDidMount() {
        warrantyAPI.index(this.props.uid)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        warranties: res.data
                    })
                }
            })
            .catch(err => console.log(err))
    }
    addWarrantyClicked = () => {
        this.setState({
            addWarrantyStatus: this.state.addWarrantyStatus ? false : true
        })
    }

    handleAddWarranty = (body, cb) => {
        warrantyAPI.create(this.props.uid,body)
            .then(res => {
                myState.set('wid', res.data.warranties[res.data.warranties.length - 1]._id);
                cb && cb()
                this.setState({
                    warranties: res.data.warranties
                })
            })
            .catch(err => console.log(err))
    }

    handleDelete = (uid, wid) => {
        warrantyAPI.destroy(uid, wid)
            .then(res => this.setState({
                warranties: this.state.warranties.filter(warranty => warranty._id !== wid)
            }))
            .catch(err => console.log(err))
    }

    render() {
        let warranties = this.state.warranties;
        return (
            <div className="WarrantyContainer border border-dark text-center">
                <h1>Warranties</h1>
                {this.state.warranties ? <p>{this.state.warranties.length} items</p> : <p>0 items</p>}
                <AddWarrantyModal uid={this.props.uid} handleAddWarranty={this.handleAddWarranty} addWarrantyClicked={this.addWarrantyClicked} addWarrantyStatus={this.state.addWarrantyStatus} />
                <button onClick={this.addWarrantyClicked} className="add-button btn btn-secondary btn-block mb-3">+</button>
                <div className="container warranties">
                    {
                        warranties && warranties.map(warranty => {
                            return <Warranty handleDelete={this.handleDelete} warranty={warranty} key={warranty._id} uid={this.props.uid}/>
                        })
                    }
                </div>
                
            </div>
        );
    }
}
