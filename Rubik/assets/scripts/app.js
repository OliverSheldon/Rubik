let React = require('react');
let ReactDOM = require('react-dom');

class Square extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return (
            <div className={
                'square square_'
                +this.props.sid+
                ' '
                +this.props.color
                }>
                </div>
        );
    }
}

class Face extends React.Component{
    constructor(props) {
        super(props);
    }

    renderSquare(i) {
        return <Square sid={i} color={this.props.squares[i].color}/>;
    }

    render(){
        return(
            <div className={'face face_' + this.props.fid}>
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
        );
    }
}

class Cube extends React.Component{
    constructor(props) {
        super(props);
    }

    renderFace(i) {
        return (
        <Face fid={this.props.value.faces[i].fid}
            squares={this.props.value.faces[i].squares}
        />);
    }

    render(){
        return(
            <div className={this.props.className}>
                {this.renderFace(0)}
                {this.renderFace(1)}
                {this.renderFace(2)}
                {this.renderFace(3)}
                {this.renderFace(4)}
                {this.renderFace(5)}
            </div>
        );
    }
}

function Button(props){
    return (
        <button onClick={props.onClick} className={props.className}>
            {props.value}
        </button>
    );
}

class Environment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            cube:{
                faces: [],
                exploded: false
            }
        };

        let fa = [];
        for(var x=0; x<6; x++){
            let sq = [];
            let c;
            switch (x) {
                case 0:
                    c='green'
                break;
                case 1:
                    c='orange'
                break;
                case 2:
                    c='white'
                break;
                case 3:
                    c='red'
                break;
                case 4:
                    c='yellow'
                break;
                case 5:
                    c='blue'
                break;
            }
            for(var y=0; y<9; y++){
                sq.push(
                    {
                        sid:y,
                        color:c
                    }
                );
            }
            let adj = [];
            //Square ids read in a clockwise direction
            switch (x) {
                case 0:
                    adj.push(
                        [{
                            top:2,
                            right:3,
                            bottom:4,
                            left:1
                        },
                        {
                            top:[6,7,8],
                            right:[0,3,6],
                            bottom:[2,1,0],
                            left:[8,5,2]
                        }]
                    );
                break;
                case 1:
                    adj.push(
                        [{
                            top:2,
                            right:0,
                            bottom:4,
                            left:5
                        },
                        {
                            top:[0,3,6],
                            right:[0,3,6],
                            bottom:[0,3,6],
                            left:[8,5,2]
                        }]
                    );
                break;
                case 2:
                    adj.push(
                        [{
                            top:5,
                            right:3,
                            bottom:0,
                            left:1
                        },
                        {
                            top:[2,1,0],
                            right:[2,1,0],
                            bottom:[2,1,0],
                            left:[2,1,0]
                        }]
                    );
                break;
                case 3:
                    adj.push(
                        [{
                            top:2,
                            right:5,
                            bottom:4,
                            left:0
                        },
                        {
                            top:[8,5,2],
                            right:[0,3,6],
                            bottom:[8,5,2],
                            left:[8,5,2]
                        }]
                    );
                break;
                case 4:
                    adj.push(
                        [{
                            top:0,
                            right:3,
                            bottom:5,
                            left:1
                        },
                        {
                            top:[6,7,8],
                            right:[6,7,8],
                            bottom:[6,7,8],
                            left:[6,7,8]
                        }]
                    );
                break;
                case 5:
                    adj.push(
                        [{
                            top:2,
                            right:1,
                            bottom:4,
                            left:3
                        },
                        {
                            top:[2,1,0],
                            right:[0,3,6],
                            bottom:[6,7,8],
                            left:[8,5,2]
                        }]
                    );
                break;
            }
            //cp == square counterparts [clockwise, anticlockwise] for self rotation
            fa.push(
                {
                    fid:x,
                    squares:sq,
                    adj:adj,
                    cp:{
                        0:[2,6],
                        1:[5,3],
                        2:[8,0],
                        3:[1,7],
                        5:[7,1],
                        6:[0,8],
                        7:[3,5],
                        8:[6,2]
                    }
                }
            );
        }

        this.state.cube.faces = fa;
    }

    renderCube(){
        return (
            <Cube value={this.state.cube}
                className={this.state.cube.exploded?'cube exploded':'cube'}
            />
        );
    }

    renderRotateButton(props) {
        return (
            <Button
                value={props.value}
                onClick={() => this.rotate(props.buttonId)}
                className={props.className}
            />
        );
    }

    rotate(i){
        // rotating face i
        let faceSquares = [];
        let squareToColor = [];
        switch (i < 6) {
            case true:
                //clockwise
                var face = this.state.cube.faces[i];
                //4 faces to change
                for(var x=0; x<4; x++){
                    switch (x) {
                        //top -> right
                        case 0:
                            //add new colours to array
                            var ca = [];
                            for(var c=0; c<3; c++){
                                ca.push(
                                    this.state.cube.faces[face.adj[0][0].top]
                                    .squares[face.adj[0][1].top[c]].color
                                );
                            }
                            faceSquares.push(
                                {
                                    //adjacent faceId
                                    fromFid: face.adj[0][0].top,
                                    //face to change
                                    toFid: face.adj[0][0].right,
                                    //colours from squares
                                    colorsFrom: ca,
                                    //squares to change
                                    squaresTo: face.adj[0][1].right
                                }
                            );
                        break;
                        //right -> bottom
                        case 1:
                            var ca = [];
                            for(var c=0; c<3; c++){
                                ca.push(
                                    this.state.cube.faces[face.adj[0][0].right]
                                    .squares[face.adj[0][1].right[c]].color
                                );
                            }
                            faceSquares.push(
                                {
                                    fromFid: face.adj[0][0].right,
                                    toFid: face.adj[0][0].bottom,
                                    colorsFrom: ca,
                                    squaresTo: face.adj[0][1].bottom
                                }
                            );                        
                        break;
                        //bottom -> left
                        case 2:
                            var ca = [];
                            for(var c=0; c<3; c++){
                                ca.push(
                                    this.state.cube.faces[face.adj[0][0].bottom]
                                    .squares[face.adj[0][1].bottom[c]].color
                                );
                            }
                            faceSquares.push(
                                {
                                    fromFid: face.adj[0][0].bottom,
                                    toFid: face.adj[0][0].left,
                                    colorsFrom: ca,
                                    squaresTo: face.adj[0][1].left
                                }
                            ); 
                            
                        break;
                        //left -> top
                        case 3:
                            var ca = [];
                            for(var c=0; c<3; c++){
                                ca.push(
                                    this.state.cube.faces[face.adj[0][0].left]
                                    .squares[face.adj[0][1].left[c]].color
                                );
                            }
                            faceSquares.push(
                                {
                                    fromFid: face.adj[0][0].left,
                                    toFid: face.adj[0][0].top,
                                    colorsFrom: ca,
                                    squaresTo: face.adj[0][1].top
                                }
                            ); 
                        break;
                    }
                }
                
                for(var s=0; s<9; s++){
                    if(face.cp[s] == undefined){
                        s++;
                        squareToColor.push(undefined);
                    }
                    squareToColor.push({
                        sid:face.cp[s][0],
                        color: face.squares[s].color
                    });
                }
            break;
        
            case false:
            //anticlockwise
                i-=6;
                var face = this.state.cube.faces[i];

                for(var x=0; x<4; x++){
                    switch (x) {
                        //top -> left
                        case 0:
                            var ca = [];
                            for(var c=0; c<3; c++){
                                ca.push(
                                    this.state.cube.faces[face.adj[0][0].top]
                                    .squares[face.adj[0][1].top[c]].color
                                );
                            }
                            faceSquares.push(
                                {
                                    fromFid: face.adj[0][0].top,
                                    toFid: face.adj[0][0].left,
                                    colorsFrom: ca,
                                    squaresTo: face.adj[0][1].left
                                }
                            );
                        break;
                        //left -> bottom
                        case 1:
                            var ca = [];
                            for(var c=0; c<3; c++){
                                ca.push(
                                    this.state.cube.faces[face.adj[0][0].left]
                                    .squares[face.adj[0][1].left[c]].color
                                );
                            }
                            faceSquares.push(
                                {
                                    fromFid: face.adj[0][0].left,
                                    toFid: face.adj[0][0].bottom,
                                    colorsFrom: ca,
                                    squaresTo: face.adj[0][1].bottom
                                }
                            );                        
                        break;
                        //bottom -> right
                        case 2:
                            var ca = [];
                            for(var c=0; c<3; c++){
                                ca.push(
                                    this.state.cube.faces[face.adj[0][0].bottom]
                                    .squares[face.adj[0][1].bottom[c]].color
                                );
                            }
                            faceSquares.push(
                                {
                                    fromFid: face.adj[0][0].bottom,
                                    toFid: face.adj[0][0].right,
                                    colorsFrom: ca,
                                    squaresTo: face.adj[0][1].right
                                }
                            ); 
                            
                        break;
                        //right -> top
                        case 3:
                            var ca = [];
                            for(var c=0; c<3; c++){
                                ca.push(
                                    this.state.cube.faces[face.adj[0][0].right]
                                    .squares[face.adj[0][1].right[c]].color
                                );
                            }
                            faceSquares.push(
                                {
                                    fromFid: face.adj[0][0].right,
                                    toFid: face.adj[0][0].top,
                                    colorsFrom: ca,
                                    squaresTo: face.adj[0][1].top
                                }
                            ); 
                        break;
                    }
                }
                for(var s=0; s<9; s++){
                    if(face.cp[s] == undefined){
                        s++;
                        squareToColor.push(undefined);
                    }
                    squareToColor.push({
                        sid:face.cp[s][1],
                        color: face.squares[s].color
                    });
                }
            break;
        }

        let newFaces = [].concat(this.state.cube.faces);
        faceSquares.forEach(fs => {           
            for(var x=0; x<3; x++){
                newFaces[fs.toFid].squares[fs.squaresTo[x]].color =
                fs.colorsFrom[x];
            }
        });
        //recolor each square on rotated face
        for(var s=0; s<9; s++){
            if(squareToColor[s] == undefined){
                s++;
            }
            newFaces[i].squares[squareToColor[s].sid].color =
            squareToColor[s].color;
        }
        this.setState({cube:{faces:newFaces}});
    }

    explode(){
        let newCube = {...this.state.cube};
        newCube.exploded = newCube.exploded == true? false: true;
        this.setState({cube:newCube});
    }

    render(){
        return(
            <div id="wrapper">
                <h1>Rubik's Cube</h1>
                <div className='cubeContainer'>
                    {this.renderCube()}
                </div>
                <div id='controls' className='container'>
                    <h2>Clockwise Rotation</h2>
                    <div className='row'>
                        {this.renderRotateButton({value : 'Front', buttonId : 0, className:'green'})}
                        {this.renderRotateButton({value : 'Left', buttonId : 1, className:'orange'})}
                        {this.renderRotateButton({value : 'Top', buttonId : 2, className:'white'})}
                        {this.renderRotateButton({value : 'Right', buttonId : 3, className:'red'})}
                        {this.renderRotateButton({value : 'Bottom', buttonId : 4, className:'yellow'})}
                        {this.renderRotateButton({value : 'Back', buttonId : 5, className:'blue'})}
                    </div>
                    <h2>Anticlockwise Rotation</h2>
                    <div className='row'>
                        {this.renderRotateButton({value : 'Front\'', buttonId : 6, className:'green'})}
                        {this.renderRotateButton({value : 'Left\'', buttonId : 7, className:'orange'})}
                        {this.renderRotateButton({value : 'Top\'', buttonId : 8, className:'white'})}
                        {this.renderRotateButton({value : 'Right\'', buttonId : 9, className:'red'})}
                        {this.renderRotateButton({value : 'Bottom\'', buttonId : 10, className:'yellow'})}
                        {this.renderRotateButton({value : 'Back\'', buttonId : 11, className:'blue'})}
                    </div>
                    <h2>Other</h2>
                    <Button
                        value="Toggle Explode"
                        onClick={() => this.explode()}
                    />
                </div>
            </div>
        );
    }
}

function App(){
    return <Environment/>;
}

ReactDOM.render(<App/>, document.getElementById("root"));