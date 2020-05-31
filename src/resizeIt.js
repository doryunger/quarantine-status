import $ from "jquery";

function resizeIt(elements,stylesheet,status){
    let heightfactor;
    let widthfactor;
    let currentWidth=$(window).width();
    let currentHeight=$(window).height();
    //console.log(currentHeight,currentWidth);
    let legend_title=elements['legend']['init']['title'];
    let legend_subtitle=elements['legend']['init']['subtitle'];
    let item_text=elements['item']['init']['text'];
    let item_height=elements['item']['init']['height'];
    let item_width=elements['item']['init']['width'];
    let item_margin_top=elements['item']['init']['margin-top'];
    let geocoder=elements['geocoder'];
    let logo_height=elements['logo']['init']['height'];
    let logo_width=elements['logo']['init']['width']
    widthfactor=Math.abs((currentWidth-1800))/100;
    heightfactor=Math.abs((currentHeight-969))/100;
    if (elements['prev_widthfactor']!=widthfactor || elements['prev_heightfactor']!=heightfactor ){
      let change='';
      if (elements['prev_widthfactor']!=widthfactor && elements['prev_heightfactor']==heightfactor){
          change='width';}
      else if(elements['prev_widthfactor']==widthfactor && elements['prev_heightfactor']!=heightfactor){
        change='height';
      }
      else{
          change='both'
      }
    elements['prev_widthfactor']=widthfactor;
    elements['prev_heightfactor']=heightfactor;
    let legend_titleFactor=widthfactor*0.027+heightfactor*0.05;
    let legend_subtitleFactor=widthfactor*0.027+heightfactor*0.05;
    let item_textFactor=widthfactor*0.027+heightfactor*0.05;
    stylesheet['legend_title']=JSON.stringify(legend_title-legend_titleFactor)+'em';
    stylesheet['legend_subtitle']=JSON.stringify(legend_subtitle-legend_subtitleFactor)+'em';
    stylesheet['item_text']=JSON.stringify(item_text-item_textFactor)+'em';
    stylesheet['item_text_2']=JSON.stringify(item_text-item_textFactor-0.2)+'em';
    let item_pixelwidthFactor=widthfactor*0.4;
    let item_pixelheightFactor=heightfactor*1.2;
    let logo_heightFactor=heightfactor*10;
    let logo_widthFactor=widthfactor*2.5;
    
    if (change=='width'){
      stylesheet['item_value_height']=JSON.stringify(item_height-item_pixelwidthFactor)+'px';
      stylesheet['item_value_width']=JSON.stringify(item_width-item_pixelwidthFactor)+'px';
      //stylesheet['item_value_margin_top']=JSON.stringify(item_margin_top+(widthfactor*(0.25)))+'%';
      stylesheet['geocoder']=JSON.stringify(geocoder-(widthfactor*47))+'px';
      $('.bottomContainer').css('left', JSON.stringify(widthfactor*0.3)+'%');
      $('.logo').css('width',  JSON.stringify(logo_width-logo_widthFactor)+'px');

    }

    else if(change=='height'){
      stylesheet['item_value_height']=JSON.stringify(item_height-item_pixelheightFactor)+'px';
      stylesheet['item_value_width']=JSON.stringify(item_width-item_pixelheightFactor)+'px';
      //stylesheet['item_value_margin_top']=JSON.stringify(item_margin_top+(heightfactor*(0.55)))+'%';
      //$('.toggleBox').css('margin-top', JSON.stringify(heightfactor+0.5)+'%');
      $('.logo').css('height',  JSON.stringify(logo_height-logo_heightFactor)+'px');
    }
    
    else{
      stylesheet['item_value_height']=JSON.stringify(item_height-item_pixelwidthFactor)+'px';
      stylesheet['item_value_width']=JSON.stringify(item_width-item_pixelwidthFactor)+'px';
      //stylesheet['item_value_margin_top']=JSON.stringify(item_margin_top+(widthfactor*(0.2)))+'%';
      stylesheet['geocoder']=JSON.stringify(geocoder-(widthfactor*47))+'px';
      //$('.toggleBox').css('margin-top', JSON.stringify(heightfactor+0.5)+'%');
      $('.bottomContainer').css('left', JSON.stringify(widthfactor*0.3)+'%');
      $('.logo').css('height',  JSON.stringify(logo_height-logo_heightFactor)+'px');
      $('.logo').css('width',  JSON.stringify(logo_width-logo_widthFactor)+'px');
      $('.geocoder').css('width',JSON.stringify(geocoder-(widthfactor*47))+'px');
    }
    if (currentWidth<600 && currentWidth>300 ){
      if (currentWidth<500 && currentWidth>400){
        $('.geocoder').css('margin-left','22%');
      }
      else if (currentWidth<400 && currentWidth>350){
        $('.geocoder').css('margin-left','17%');
      }
      else if (currentWidth<350 && currentWidth>300){
        $('.geocoder').css('margin-left','9%');
      }
      if ($('.topContainer').css('display')=='none'){
        $('.topContainer').css('display','flex');
      }
  }
  else if  (currentWidth >650 ){
    $('.geocoder').css('margin-left','35%');
    //$('.toggleBox').css('margin-top', '0.5%');
    $('.bottomContainer').css('left', '2%');
  }
  else if (currentWidth <300 ){
    $('.topContainer').css('display','none');
  }
  if (currentHeight <400 ){
    $('.bottomContainer').css('display','none');
  }
  else if (currentHeight >400 ){
    if ( $('.bottomContainer').css('display')=='none'){
      $('.bottomContainer').css('display','flex');
    }
  }

  }
  if (status=='new'){
    let legend_titleFactor=widthfactor*0.027+heightfactor*0.05;
    let legend_subtitleFactor=widthfactor*0.027+heightfactor*0.05;
    let item_textFactor=widthfactor*0.027+heightfactor*0.05;
    stylesheet['legend_title']=JSON.stringify(legend_title-legend_titleFactor)+'em';
    stylesheet['legend_subtitle']=JSON.stringify(legend_subtitle-legend_subtitleFactor)+'em';
    stylesheet['item_text']=JSON.stringify(item_text-item_textFactor)+'em';
    stylesheet['item_text_2']=JSON.stringify(item_text-item_textFactor-0.2)+'em';
    let item_pixelwidthFactor=widthfactor*0.4;
    let item_pixelheightFactor=heightfactor*1.2;
    let logo_heightFactor=heightfactor*16;
    let logo_widthFactor=widthfactor*2.5;
    if (currentWidth<600 && currentWidth>300 ){
      if (currentWidth<500 && currentWidth>400){
        $('.geocoder').css('margin-left','22%');
      }
      else if (currentWidth<400 && currentWidth>350){
        $('.geocoder').css('margin-left','17%');
      }
      else if (currentWidth<350 && currentWidth>300){
        $('.geocoder').css('margin-left','9%');
      }
      if ($('.topContainer').css('display')=='none'){
        $('.topContainer').css('display','flex');
      }
  }
  else if  (currentWidth>600 ){
    $('.geocoder').css('margin-left','35%');

  }
  else if (currentWidth<300 ){
    $('.topContainer').css('display','none');
  }
  if (currentHeight<400 ){
    $('.bottomContainer').css('display','none');
  }
  else if (currentHeight>400 ){
    if ( $('.bottomContainer').css('display')=='none'){
      $('.bottomContainer').css('display','flex');
    }
  }
    if (widthfactor>1 && heightfactor<1){
      stylesheet['item_value_height']=JSON.stringify(item_height-item_pixelwidthFactor)+'px';
      stylesheet['item_value_width']=JSON.stringify(item_width-item_pixelwidthFactor)+'px';
      //stylesheet['item_value_margin_top']=JSON.stringify(item_margin_top+(widthfactor*(0.25)))+'%';
      stylesheet['geocoder']=JSON.stringify(geocoder-(widthfactor*47))+'px';
      $('.geocoder').css('width',JSON.stringify(geocoder-(widthfactor*47))+'px');
      //$('.toggleBox').css('margin-top', JSON.stringify(widthfactor+0.5)+'%');
      $('.bottomContainer').css('left', JSON.stringify(widthfactor*0.3)+'%');
     
    }
    else{
    $('.geocoder').css('width',JSON.stringify(elements['geocoder'])+'px');
    }
    if (heightfactor>1 && widthfactor<1){
      stylesheet['item_value_height']=JSON.stringify(item_height-item_pixelheightFactor)+'px';
      stylesheet['item_value_width']=JSON.stringify(item_width-item_pixelheightFactor)+'px';
      //stylesheet['item_value_margin_top']=JSON.stringify(item_margin_top+(heightfactor*(0.55)))+'%';
     
    }
    if (widthfactor>1 && heightfactor>1){
      stylesheet['item_value_height']=JSON.stringify(item_height-item_pixelwidthFactor)+'px';
      stylesheet['item_value_width']=JSON.stringify(item_width-item_pixelwidthFactor)+'px';
      //stylesheet['item_value_margin_top']=JSON.stringify(item_margin_top+(widthfactor*(0.2)))+'%';
      stylesheet['geocoder']=JSON.stringify(geocoder-(widthfactor*47))+'px';
      //$('.toggleBox').css('margin-top', JSON.stringify(heightfactor+0.8)+'%');
      $('.bottomContainer').css('left', JSON.stringify(widthfactor*0.3)+'%');
      $('.geocoder').css('width',JSON.stringify(geocoder-(widthfactor*47))+'px');
      $('.logo').css('height',  JSON.stringify(logo_height-logo_heightFactor)+'px');
      $('.logo').css('width',  JSON.stringify(logo_width-logo_widthFactor)+'px');

    }
  }
  
  }

  export {resizeIt};