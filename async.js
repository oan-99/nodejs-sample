const http = require("http")
const url = require('url')
const fetch = require('node-fetch')


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
        
        webUrl = "https://" + elem;
        data = "";

        webPromise = async (webUrl, ind, arr) =>{ 
            
                return fetch(webUrl)

                .then(webResp => webResp.text())

                .then(webBody => {
                    webTitle = webBody.match("<title>(.*?)</title>");
                    if(webTitle != null)
                        webTitle = webTitle[1]
                    console.log(webUrl + " " + webTitle)
                    listTag = "<li>" + webUrl + " - " + webTitle + "</li>";
                    res.write(listTag)
                    
                    
                 
                    

                    

                })

                .catch(error => {
                    webTitle = "NO RESPONSE"
                    listTag = "<li>" + webUrl + " - NO RESPONSE</li>";
                    console.log(webUrl + " " + webTitle)
                    res.write(listTag)
                    
                    
                    
                    
                       
                    
            })

            
            
            
        
        }
        
        webPromise(webUrl, ind, arr)
        .then(() => {
            if(ind == arr.length-1){
                body = "</ul>"
                body += "</body>"
                body += "</html>"
                res.write(body)
                res.end()
            }
        })
        .catch(error =>{
            console.log("Error " + error)
        })

        
        
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