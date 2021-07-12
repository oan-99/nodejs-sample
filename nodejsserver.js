const http = require("http")
const url = require('url')

const hostname = '127.0.0.1'
const port = process.env.PORT || 8080

function ConstructPage(addrParams, res){
    
    body = "<html>"
    body += "<head></head>"
    body += "<body>"
    body += "<h1> Following are the titles of given websites: </h1>"
    body += "<ul>"
    res.write(body);
        
    addrParams.forEach((elem, ind, arr) => {
        
        webUrl = "http://" + elem;
        //console.log(webUrl)
        data = "";
        webTitle = "";

        
        req = http.request(webUrl, (resp) => {
            //console.log(webUrl)
            resp.on('data', (chunk) => {
                data += chunk
            }).on('end', () => {
                
                webTitle = data.match("<title>(.*?)</title>");
                if(webTitle != null)
                    webTitle = webTitle[1]
                //console.log(webTitle)
                console.log(webUrl)
                //console.log(elem)
                
                listTag = "<li>" + webUrl + " - " + webTitle + "</li>";
                res.write(listTag)
                console.log(arr)
                if(ind == arr.length-1){
                    body = "</ul>";
                    body += "</body>";
                    body += "</html>";
                    res.write(body)
                    
                    res.end()
                }
                
        
            })
        })
        req.on('error', () => {
            
            webTitle = "NO RESPONSE"
            //console.log(webTitle)
            console.log(webUrl)
            //console.log(elem)
            listTag = "<li>" + webUrl + " - NO RESPONSE</li>";
            res.write(listTag)
            //console.log(arr)
            if(ind == arr.length-1){
                body = "</ul>";
                body += "</body>";
                body += "</html>";
                res.write(body)
                res.end()
            }
            
        })
        req.end();
            

    });
    


        
}



const server = http.createServer((req, res) => {
    
    
    addr = new URL(req.url, `http:\\${req.headers.host}`)
    
    
    if(addr.pathname == "/I/want/title/"){
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        addrParams = addr.searchParams.getAll("address")

        if(addrParams.length >= 1){
            ConstructPage(addrParams, res)
            
        }
        else{
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain')
            res.write("Error 404")
            res.end();
        }

    }
    else if(addr.pathname != "/favicon.ico"){
        
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.write("Error 404")
        res.end(); 

    }
    else { // if it is favion.ico request, then simply ignore
    }
    
    

})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})