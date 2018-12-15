// function pageFunction(context) {
//     // called on every page the crawler visits, use it to extract data from it
//     var $ = context.jQuery;
         
//    const addressSelector = $('.ev-teaser-subtitle');
//     const priceSelector = $('.ev-value');
    
//     var results = [];


// $('.ev-teaser-content').each(function(el, i) {

    
//  var items = [];
    
//     items = $($('.ev-teaser-attributes')[el]).children();
    
//    results.push({
//        Rooms: $(items[0]).text(),
//       Square : $(items[2]).text(),
//       Parcel : $(items[3]).text(), 
 
//       Price: $($(priceSelector)[el]).text(),
//       Address: $($(addressSelector)[el]).text()
       
//    });
//          });    
                            
//     return results;
// }