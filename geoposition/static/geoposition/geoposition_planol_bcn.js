if (jQuery != undefined) {
    var django = {
        'jQuery': jQuery,
    }
}


(function($) {

    $(document).ready(function() {

        try {
            var _ = geobcn;
        } catch (ReferenceError) {
            console.log('geoposition: "geobcn" not defined.  You might not be connected to the internet.');
            return;
        }

        var mapDefaults = {
            "controls": true,
            "proj": 'EPSG:4326',
            "zoom": 3,
            "scrollwheel": true,
        };


        $('.geoposition-widget').each(function(index) {
            var $container = $(this),
                idMap = 'contact-map' + index,
                $mapContainer = $('<div class="geoposition-map" id="' + idMap + '" >'),
                $addressRow = $('<div class="geoposition-address" />'),
                $searchRow = $('<div class="geoposition-search" />'),
                $latitudeField = $container.find('input.geoposition:eq(0)'),
                $longitudeField = $container.find('input.geoposition:eq(1)'),
                map,
                mapLatLng,
                mapOptions,
                default_lat = 41.387521,
                default_lng = 2.169717;

            markerCustomOptions = JSON.parse($container.attr('data-marker-options'));
            if (markerCustomOptions !== null && markerCustomOptions.position !== undefined) {
                if (markerCustomOptions.position !== null && markerCustomOptions.position.lat !== undefined && markerCustomOptions.position.lat !== null) {
                    default_lat = parseFloat(markerCustomOptions.position.lat)
                }
                if (markerCustomOptions.position !== null && markerCustomOptions.position.lng !== undefined && markerCustomOptions.position.lng !== null) {
                    default_lng = parseFloat(markerCustomOptions.position.lng)
                }
            }

            var latitude = parseFloat($latitudeField.val()) || default_lat,
                longitude = parseFloat($longitudeField.val()) || default_lng;

            $mapContainer.css('height', $container.attr('data-map-widget-height') + 'px');

            $container.append($searchRow, $mapContainer, $addressRow);

            mapLatLng = bcnPlanol.maps.LatLng(latitude, longitude);

            function setGuideDetailPlanolBCNPoints() {
                var feature = {
                  'id': idMap,
                  'latLng': mapLatLng,
                  'proj': 'EPSG:4326'
                };
                bcnPlanol.maps.addPoint(feature);
            }

            mapOptions = $.extend({}, mapDefaults, {"center": mapLatLng, "callback": setGuideDetailPlanolBCNPoints});

            function initMap() {
                if ($container.length > 0 && typeof bcnPlanol.maps !== 'undefined') {
                    map = new bcnPlanol.maps.Map(idMap, mapOptions);
                }
            }

            if (typeof geobcn !== "undefined") {
                geobcn.apiManager($container.attr('data-api-key'), 'v2', initMap);
            }
        });
    });
})(django.jQuery);
