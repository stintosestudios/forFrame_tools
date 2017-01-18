
// baseUrl : where to look for the collection of images

// raw git
var baseUrl = 'https://raw.githubusercontent.com/stintosestudios/';

// local
//var baseUrl = '/img/';

/*    The forframe_gif tag
 *
 *    use this tag in your makdown, if you want to inject a singel gif.
 *
 *    makedown use:
 *
 *    {% forframe_gif collection_1_0_42 the_canvas 320 %}
 *
 */
hexo.extend.tag.register('forframe_gif', function (args) {

    var collectionName = [args[0]],
    projectName = [args[1]],
    size = 320,
    projectUrl = baseUrl + 'forFrame_' + collectionName + '/master/projects/' + projectName + '/',
    gifUrl = projectUrl + 'gif/gif_1_' + size + '.gif';

    // default to 320 width gifs
    if (args[2]) {

        size = args[2];

    }

    return '<img class="forframe_lone_gif" src=\"' + gifUrl + '\">';

});

/*    The forframe_tumbs tag
 *
 *    makedown use:
 *
 *    {% forframe_thumbs collection_1_0_42 chicken;circle_pointer;fractal_1;logo;sections;the_canvas %}
 *
 */
hexo.extend.tag.register('forframe_thumbs', function (args) {

    var collectionName = args[0],
    projects = args[1].split(';'),
    projectUrl,
    thumUrl,
    gifUrl,
    html,
    size = 320;

    if (args[2]) {

        size = args[2];

    }

    html = '<div class="forframe_thumb_container">';
    html += '<h2><a href=\"forframe\/' + collectionName + '.html\">' + collectionName + '</a><\/h2>';
    projects.forEach(function (projectName) {

        projectUrl = baseUrl + 'forFrame_' + collectionName + '/master/projects/' + projectName + '/',
        thumUrl = projectUrl + 'thum_128.png';
        gifUrl = projectUrl + 'gif/gif_1_' + size + '.gif';

        html += '<a class="forframe_thumb_link" href="' + gifUrl + '"><img class=\"forframe_thumb_img\" src="' + thumUrl + '"></a>'

    });

    return html + '<\/div>';

});
