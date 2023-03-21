<p align="center"><h1> Influencers Api</h1></p>

### Development Setup
----------------------
```bash
# install deps
npm install
```

### The .ENV file 
-------------
```bash
# copy .example.env to .env
cp .example.env .env

## configure you env file ##
```

<ul>
<li> PORT - the node port (8000) </li>
<li> NODE_ENV - enviroment (development, staging, production) </li>
</ul>


### The .config.json file
-------------

```bash
# copy /src/config/config.example.json to /src/config/config.json
cp src/config/config.example.json src/config/config.json

## configure you config file ##
```

<ul>
<li> API_KEY  </li>
<li> API_SECRET  </li>
<li> SHOP_NAME  </li>
<li> DB_HOSTNAME  </li>
<li> DB_USERNAME  </li>
<li> DB_PASSWORD  </li>
<li> DB_PORT  </li>
<li> DB_DB  </li>
</ul>

### The scripts
-------------

```bash
# start server in production
npm run start

# serve examples at localhost:8000
npm run dev

```
