import React from 'react';
import { useContext } from 'react';
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import $ from "jquery";
import './style.css'; 
import {resizeIt} from './resizeIt';
import {CheckStatus,forwardGeocoder} from './helpers';
import Cookies from 'universal-cookie';
import {ShepherdTour, ShepherdTourContext} from 'react-shepherd';


//Initialize variables 
let layersList=[]
let elements={'legend':{'init':{'height':175,'width':228,'title':1.5,'subtitle':1.2}},'item':{'init':{'height':12,'width':12,'text':1.1,'margin-top':3.9}},'logo':{'init':{'width':106,'height':100}},'btmCon':{'right':2},'toggle':{'margin-top':0.5},'geocoder':850,'prev_heightfactor':null,'prev_widthfactor':null};
let stylesheet={};
let map;
let geocoder;
let geocoderActive='false';
var MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
let func;
const cookies = new Cookies();
const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: false
    },
    classes:'shepherd-arrows'
  },
  useModalOverlay: true
};
//const tour = Shephe;
const steps = [
  { id: 'start',
  attachTo: '.geocoder bottom',
  beforeShowPromise: function() {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, 1500);
    });
  },
  buttons: [
    {
      classes: 'shepherd-button-primary',
      text: 'Next',
      type: 'next'
    }
  ],
  title: "Welcome to Jerusalem's Quarntine App",
  text: ["This map stores data uniquely produced for Jerusalem. The data contains the current quarantine status of each neighborhood and the average number of cases in each statistical area. For your convenience, there's a legend at the bottom left corner of the map"],
},{
    id: 'geocoder',
      attachTo: {element: '.geocoder', on: 'bottom'},
      beforeShowPromise: function() {
        return new Promise(function(resolve) {
          setTimeout(function() {
            resolve();
          }, 500);
        });
      },
      buttons: [
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next'
        }
      ],
      title: 'geocoder',
      text: ['Allows you to get a status of a specific address in Jerusalem by typing it at the geocoder (partially support  English at the moment)'],
  },
  {
    id: 'toggle',
      attachTo: {element: '.toggleBox', on: 'bottom'},
      beforeShowPromise: function() {
        return new Promise(function(resolve) {
          setTimeout(function() {
            resolve();
          }, 500);
        });
      },
      buttons: [
        {
          classes: 'shepherd-button-primary',
          text: 'Done',
          type: 'next'
        }
      ],
      title: 'toggle button',
      text: ["Switches between quarantine status map and a 3D display of a number of cases in statistical areas('stats')."],
  },
];
function Button() {
  const tour = useContext(ShepherdTourContext);
  return (
    <button className="button dark" onClick={tour.start}>
      Start Tour
    </button>
  );
}
//Creates legend elemnt by layer type
function Legend(activeState){ 

  //Define style varaibles
  const title={
    fontSize:stylesheet['legend_title']};
  const subtitle={
    fontSize:stylesheet['legend_subtitle']};
  const item_text={
    fontSize:stylesheet['item_text']};
  let divclass;

  
  if (activeState.activeState.id==0){
    divclass='textdiv';}
  else if (activeState.activeState.id==1){
    divclass='textdiv leftend';}
  const renderLegend = (stop, i) => {
      return (
        <div key={i} className={divclass}>
          <span className='legenditem' style={{ backgroundColor: stop[0], height:stylesheet['item_value_height'],width:stylesheet['item_value_width'],marginTop:stylesheet['item_value_margin_top'] }} />
          <span className='space'></span>
          <span className='item_text' style={item_text}> {`${stop[1].toLocaleString()}`}</span>
        </div>
      );
    }

  const [dimensions, setDimensions] = React.useState({ 
      height: $(window).height(),
      width: $(window).width()
    })
  //The function is also holding a 'hook' which is upading the legend whenever the deminsions of the window got changed 
  React.useEffect(() => {
      function handleResize() {
        resizeIt(elements,stylesheet);
        setDimensions({
          height: $(window).height(),
          width: $(window).width()
      })}
      window.addEventListener('resize', handleResize)
      return _ => {
        window.removeEventListener('resize', handleResize)
      
    }})
  //return of the function which builds the legend items 
  return <div className='bottomContainer'>
     <div className='legend'>
    <div className='mb6'>
      <h2 className="legend_text" style={title}>{activeState.activeState.name}</h2>
      <p className='title'style={subtitle}>{activeState.activeState.description}</p>
      </div>
      {activeState.activeState.stops.map(renderLegend)}
      < span className='date_text' style={{fontSize:stylesheet['item_text_2']}}>{activeState.activeState.property}</span>
      </div>
      </div>
}
//options array stores the details of each 'mode' 
const options = [{
  id:0,
  name: 'Legend',
  type:'status',
  description: "Neighborhood's Quarantine Status",
  property: 'Last Update: 13.04.2020',
  stops: [
    ['#A0262E','Limited Access Area' ],
    ['#20652C','Non-Limited Access Area']
  ],
  layers:[{'id':'jer-admin','type':'line','source':'jlm_data_source','source-layer':'jlm_neighborhoods_line_dissolved','line-color':'#cdad00','line-width':5},
          {'id':'neighborhoods_layer','type':'fill','source':'jlm_data_source','source-layer':'jlm_neighborhoods','fill-color':'rgba(0,0,0,0)','fill-opacity':0},
          {'id':'neighborhoods_highlight','type':'fill','source':'jlm_data_source','source-layer':'jlm_neighborhoods','fill-color':'rgba(0,0,0,0)','fill-opacity':0.5}]
}, {
  id:1,
  name: 'Legend',
  type:'stats',
  description: "An average number of cases",
  property: 'Last Update: 16.04.2020',
  stops: [
    ['#142850',0],
    ['#27496d',5],
    ['#0c7b93',10],
    ['#00a8cc',15],
    ['#abdfeb',20]
  ],
  layers:[{'id':'jer-admin','type':'line','source':'jlm_data_source','source-layer':'jlm_stat_areas_line_dissolved','line-color':'#cdad00','line-width':5},
          {'id':'neighborhoods_score','type':'fill-extrusion','source':'jlm_data_source','source-layer':'jlm_stat_areas','fill-extrusion-color':['interpolate',['exponential',2],
          ['get', 'score'],0, '#142850',5, '#27496d',10, '#0c7b93',15, '#00a8cc',20, '#abdfeb'],'fill-extrusion-opacity':0.7,'fill-extrusion-base':0}]}];

$(document).ready(function() {
  resizeIt(elements,stylesheet);
  ReactDOM.render(<Application />, document.getElementById('app'));
  resizeIt(elements,stylesheet,'new');

});

//The main component that holdes the map itself
class Application extends React.Component {
  
  mapRef = React.createRef();
  map;

  constructor(props: Props) {
    super(props);
    this.state = {
      active: options[0]
    };
  }

  componentDidUpdate() {
    this.setLayer();
  }

  componentDidMount() {
     
      mapboxgl.accessToken = process.env.REACT_APP_TOKEN;
      map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/navigation-guidance-night-v4',
      center: [35.24069, 31.80075],
      zoom: 11.38
    });
    geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      localGeocoder: forwardGeocoder,
      marker: {
          color: 'orange'
      },
      mapboxgl: mapboxgl,
      getItemValue:({place_name,center}) => {CheckStatus('geocoder',center,map,geocoder,geocoderActive); return place_name;}
      });
      geocoder.on('results',function(){if (map._delegatedListeners.mousemove.length==0){geocoderActive='true';}});

      document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    map.on('load', () => {
      map.addSource('jlm_data_source', {
        type: 'vector',
        url:'mapbox://mikethe1.c8mh0qff'
      });

      this.setLayer();
    });
    
    if (this.state.active.id==0)
    {
      func=function(e){CheckStatus('hover',[e.lngLat.lng,e.lngLat.lat],map,geocoder,geocoderActive)};
      map.on('mousemove', 'neighborhoods_layer', func);
    }
    if (!cookies.get('quarantine')){
        cookies.set('quarantine','quarantine');
        $('.button.dark').trigger('click');
      }
  }
  setLayer(){
    if (layersList.length>0){
      layersList.forEach(function(element) {
      map.removeLayer(element)
  });
  layersList=[];
}
    const{layers}=this.state.active;
    let i;
    for(i=0; i<layers.length;i++)
    {
      if (layers[i]['type']=='line'){
        map.addLayer({
          id: layers[i]['id'],
          type:layers[i]['type'],
          source:layers[i]['source'],
          'source-layer':layers[i]['source-layer'],
          paint:{
            'line-color':layers[i]['line-color'],
            'line-width':layers[i]['line-width']
          }
        });
        layersList.push(layers[i]['id']);
      }
      else if (layers[i]['type']=='fill'){
        map.addLayer({
					'id': layers[i]['id'],
					'type': layers[i]['type'],
					'source':layers[i]['source'],
					'source-layer':layers[i]['source-layer'],
					'paint': {
						'fill-color': layers[i]['fill-color'],
						'fill-opacity':layers[i]['fill-opacity']}
        });
        layersList.push(layers[i]['id']);
      }
      else if (layers[i]['type']=='fill-extrusion')
      {
        let data;
        let ids=[];
        let expression = ['match', ['get', 'id']];
        let extrudeFactor=250;

        data=map.querySourceFeatures('jlm_data_source', {sourceLayer: 'jlm_stat_areas'})
        data.forEach(function(row) {
          if (!ids.includes(row['properties']['id']))
          {
          ids.push(row['properties']['id']);
          var new_rank = (row['properties']['rank'] * extrudeFactor );
          expression.push(row['properties']['id'], new_rank);
			}
			});
      expression.push(0);
        map.addLayer({
          'id': layers[i]['id'],
          'type': layers[i]['type'],
          'source': layers[i]['source'],
          'source-layer':layers[i]['source-layer'],
          'paint': {
            'fill-extrusion-color':layers[i]['fill-extrusion-color'],
            'fill-extrusion-opacity':layers[i]['fill-extrusion-opacity'],
            'fill-extrusion-base':layers[i]['fill-extrusion-base'],
             'fill-extrusion-height': expression}
        });
        map.setPitch(40);
        layersList.push(layers[i]['id']);
      }
    }
  if (this.state.active.id==0){
    map.setPitch(0);
    geocoder.onRemove(map);
    geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      localGeocoder: forwardGeocoder,
      marker: {
          color: 'orange'
      },
      mapboxgl: mapboxgl,
      getItemValue:({place_name,center}) => {CheckStatus('geocoder',center,map,geocoder,geocoderActive); return place_name;}
      });
      document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
  }
  else if(this.state.active.id==1){
    geocoder.onRemove(map);
    geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      localGeocoder: forwardGeocoder,
      marker: {
          color: 'orange'
      },
      mapboxgl: mapboxgl,
      getItemValue:(item) => item.place_name
			 });

      document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
  }
  };

  render() {
    
    const { name, description, stops, property } = this.state.active;
    const renderOptions = (option, i) => {
      return (
        <label key={i} className="toggle-container">
          <input onChange={() => this.setState({ active: options[i] })} checked={option.property === property} name="toggle" type="radio" />
          <div className="toggle txt-s py3 toggle--active-white">{option.type}</div>
        </label>
      );
    }
   
      
     
  
    return (
      <div>
        <div id='map' ref={this.mapRef} className="absolute top right left bottom" />
        <div id='topContainer' className='topContainer'>
        <div id="geocoder" className="geocoder"></div>
        <div className="toggleBox">
          {options.map(renderOptions)}
        </div>
        </div>
        <Legend activeState={this.state.active}/>
        <ShepherdTour steps={steps} tourOptions={tourOptions}>
         <Button/>
        </ShepherdTour>
      </div>
    );
    
  }
}

