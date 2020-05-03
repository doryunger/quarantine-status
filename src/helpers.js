import * as turf from '@turf/turf';
import * as d3 from "d3";
let entries;
d3.json('new_address.geojson').then((data)=> {
    entries=data;
  });

function CheckStatus(source,coords,map,geocoder,geocoderActive){
    let func = function(e){CheckStatus('hover',[e.lngLat.lng,e.lngLat.lat],map)};
    let item;
    let polygon=''
    var features=map.querySourceFeatures('jlm_data_source', {sourceLayer: 'jlm_neighborhoods'});
    for (item in features){
      let point=turf.point(coords)
      try{
        polygon=turf.polygon(features[item]['geometry']['coordinates'])
      }
      catch(e){
         polygon=turf.polygon(features[item]['geometry']['coordinates'][0]);
      }
      let result=turf.booleanContains(polygon, point);
      if (result){
        if (features[item]['properties']['status']==0)
        {
          map.setPaintProperty('neighborhoods_highlight', 'fill-color', 'green');
          map.setFilter('neighborhoods_highlight',['in', 'id' ,features[item]['properties']['id']]);
        }
        else if (features[item]['properties']['status']==1){
          map.setPaintProperty('neighborhoods_highlight', 'fill-color', 'red');
          map.setFilter('neighborhoods_highlight', ['in', 'id' ,features[item]['properties']['id']]);
        }
  
      }
    };
    if (source=='geocoder'){
          map.off('mousemove', 'neighborhoods_layer', func);
          startHovering(map,func,geocoder,geocoderActive);
      }
  };

  function startHovering(map,func,geocoder,geocoderActive)
    {
    	setTimeout(function(){map.once('movestart',function(){
		  if (geocoderActive=='false'){
		      geocoder.clear();
		      map.on('mousemove', 'neighborhoods_layer', func)}});
		      geocoderActive='false'}, 3500); 
    }

    function forwardGeocoder(query) {
        let matchingFeatures = [];
        for (var i = 0; i < entries.features.length; i++) {
        let feature = entries.features[i];
        if (
        feature.properties.address.toLowerCase().search(query.toLowerCase()) !== -1
        ) {
        feature['place_name'] = feature.properties.address+', ירושלים, ישראל';
        feature['center'] = feature.geometry.coordinates;
        matchingFeatures.push(feature);
        }
      }
        return matchingFeatures;
      }

  export {CheckStatus,startHovering,forwardGeocoder};
  