<img src="https://cdn-images-1.medium.com/max/1200/1*BTGStLRXsQUbkp0t-oxJhQ.png" width="200" />

# Pinata SDK

Official NodeJS SDK for [Pinata](https://pinata.cloud)

## Overview

The Pinata NodeJS SDK provides the quickest / easiest path for interacting with the [Pinata API](https://pinata.cloud/documentation#GettingStarted).

## Installation
```
npm install --save @pinata/sdk
```

## Setup
To start, simply require the Pinata SDK and set up an instance with your Pinata API Keys. Don't know what your keys are? Check out your [Account Page](https://pinata.cloud/account).
```javascript
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('yourPinataApiKey', 'yourPinataSecretApiKey');
```

Quickly test that you can connect to the API with the following call:
```javascript
pinata.testAuthentication(yourPinataApiKey, yourPinataSecretApiKey).then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

## Usage
Once you've set up your instance, using the Pinata SDK is easy. Simply call your desired function and handle the results of the promise.

* Pinning
  * [addHashToPinQueue](#addHashToPinQueue-anchor)
  * [pinFileToIPFS](#pinFileToIPFS-anchor)
  * [pinHashToIPFS](#pinHashToIPFS-anchor)
  * [pinJobs](#pinJobs-anchor)
  * [pinJSONToIPFS](#pinJSONToIPFS-anchor)
  * [removePinFromIPFS](#removePinFromIPFS-anchor)

* Data
  * [testAuthentication](#testAuthentication-anchor)
  * [userPinList](#userPinList-anchor)
  * [userPinnedDataTotal](#userPinnedDataTotal-anchor)
<br />

<a name="addHashToPinQueue-anchor"></a>
### `addHashToPinQueue`
Adds a hash to Pinata's pin queue to be pinned asynchronously. For the synchronous version of this operation see: [pinHashToIPFS](#pinHashToIPFS-anchor)

##### `pinata.addHashToPinQueue(hashToPin, options)`
##### Params
* `hashToPin` - A string for a valid IPFS Hash (Also known as a CID)
* `options` (optional): A JSON object that can contain following keyvalues:
  * `host_nodes` (optional): An array of [multiaddresses for nodes](#hostNode-anchor) that are currently hosting the content to be pinned
  * `pinataMetadata` (optional): A JSON object with [optional metadata](#metadata-anchor) for the hash being pinned
#### Response
```
{
    id: This is Pinata's ID for the pin job,
    IpfsHash: This is the IPFS multi-hash provided to Pinata to pin,
    status: The current status of the pin job. If the request was successful the status should be 'searching'.
    name: The name of the pin (if provided initially)
}
```
##### Example Code
```javascript
const options = {
    host_nodes: [
        '/ip4/host_node_1_external_IP/tcp/4001/ipfs/host_node_1_peer_id',
        '/ip4/host_node_2_external_IP/tcp/4001/ipfs/host_node_2_peer_id'
    ],
    pinataMetadata: {
        name: MyCustomName,
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    }
};
pinata.addHashToPinQueue('yourHashHere', options).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

<a name="pinFileToIPFS-anchor"></a>
### `pinFileToIPFS`
Send a file to to Pinata for direct pinning to IPFS.

##### `pinata.pinFileToIPFS(readableStream, options)`
##### Params
* `readableStream` - A [readableStream](https://nodejs.org/api/stream.html) of the file to be added 
* `options` (optional): A JSON object that can contain the following keyvalues:
  * `pinataMetadata` (optional): A JSON object with [optional metadata](#metadata-anchor) for the file being pinned
  * `pinataOptions` (optional): A JSON object with additional [options](#metadata-anchor) for the file being pinned
#### Response
```
{
    IpfsHash: This is the IPFS multi-hash provided back for your content,
    PinSize: This is how large (in bytes) the content you just pinned is,
    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
}
```
##### Example Code
```javascript
const fs = require('fs');
const readableStreamForFile = fs.createReadStream('./yourfile.png');
const options = {
    pinataMetadata: {
        name: MyCustomName,
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};
pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

<a name="pinHashToIPFS-anchor"></a>
Provide Pinata's a hash for content that is already pinned elsewhere on the IPFS network. Pinata will then syncronously search for this content and pin it on Pinata once the content is found. For the asynchronous version of this operation see: [addHashToPinQueue](#addHashToPinQueue-anchor)

### `pinHashToIPFS`
##### `pinata.pinHashToIPFS(hashToPin, options)`
##### Params
* `hashToPin` - A string for a valid IPFS Hash (Also known as a CID)
* `options` (optional): A JSON object that can contain following keyvalues:
  * `host_nodes` (optional): An array of [multiaddresses for nodes](#hostNode-anchor) that are currently hosting the content to be pinned
  * `pinataMetadata` (optional): A JSON object with [optional metadata](#metadata-anchor) for the hash being pinned
#### Response
```
{
    IpfsHash: This is the IPFS multi-hash provided back for your content,
    PinSize: This is how large (in bytes) the content you just pinned is,
    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
}
```
##### Example Code
```javascript
const options = {
    host_nodes: [
        '/ip4/host_node_1_external_IP/tcp/4001/ipfs/host_node_1_peer_id',
        '/ip4/host_node_2_external_IP/tcp/4001/ipfs/host_node_2_peer_id'
    ],
    pinataMetadata: {
        name: MyCustomName,
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    }
};
pinata.pinHashToIPFS('yourHashHere', options).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

<a name="pinJobs-anchor"></a>
### `pinJobs`
This endpoint allows users to search for the status of all hashes that are currently in Pinata's pin queue. Records in the pin queue arrived there through either the [addHashToPinQueue](#addHashToPinQueue-anchor) operation or by failing during a [pinHashToIPFS](#pinHashToIPFS-anchor) operation.

##### `pinata.pinJobs(filters)`
##### Params
* `filters` (optional): An object that can consist of the following optional query parameters:
  * `sort` (optional): How you wish for the records in the response to be sorted. Valid inputs for this are:
    * `'ASC'`
    * `'DESC'`
  * `status` (optional): What the current status of the record is in the pin queue. Valid statuses and their meanings are:
    * `searching` - Pinata is actively searching for your content on the IPFS network. This may take some time if your content is isolated.
    * `expired` - Pinata wasn't able to find your content after a day of searching the IPFS network. Please make sure your content is hosted on the IPFS network before trying to pin again.
    * `over_free_limit` - Pinning this object would put you over the free tier limit. Please add a credit card to continue pinning content.
    * `over_max_size` - This object is too large of an item to pin. If you're seeing this, please contact us for a more custom solution.
    * `invalid_object` - The object you're attempting to pin isn't readable by IPFS nodes. Please contact us if you receive this, as we'd like to better understand what you're attempting to pin.
    * `bad_host_node` - The provided host node(s) were either invalid or unreachable. Please make sure all provided host nodes are online and reachable.

  * `ipfs_pin_hash` (optional): A string for a valid IPFS hash (also known as a CID) to search for 
  * `limit` (optional): Limit the amount of results returned per page of results (default is 5, and max is also 1000)
  * `offset` (optional): Provide the record offset for records being returned. This is how you retrieve records on additional pages (default is 0)
#### Response
```
{
    count: (this is the total number of pin job records that exist for the query filters you passed in),
    rows: [
        {
            id: (the id for the pin job record),
            ipfs_pin_hash: (the IPFS multi-hash for the content you pinned),
            date_queued: (The date this hash was initially queued to be pinned - represented in ISO 8601 format),
            name: (If you passed in a name for your hash, it will be listed here),
            status: (The current status for the pin job)
        },
        {
            same record format as above
        }
        .
        .
        .
    ]
}
```
##### Example Code
```javascript
const filters = {
    sort: 'ASC',
    status: 'searching',
    ipfs_pin_hash: 'Qma6e8dovfLyiG2UUfdkSHNPAySzrWLX9qVXb44v1muqcp',
    limit: 10,
    offset: 0
};
pinata.pinJobs('yourHashHere', filters).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

<a name="pinJSONToIPFS-anchor"></a>
### `pinJSONToIPFS`
Send JSON to to Pinata for direct pinning to IPFS.

##### `pinata.pinJSONToIPFS(body, options)`
##### Params
* `body` - Valid JSON you wish to pin to IPFS
* `options` (optional): A JSON object that can contain the following keyvalues:
  * `metadata` (optional): A JSON object with [optional metadata](#metadata-anchor) for the hash being pinned
  * `pinataOptions` (optional): A JSON object with additional [options](#metadata-anchor) for the JSON being pinned
#### Response
```
{
    IpfsHash: This is the IPFS multi-hash provided back for your content,
    PinSize: This is how large (in bytes) the content you just pinned is,
    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
}
```
##### Example Code
```javascript
const body = {
    message: 'Pinatas are awesome'
};
const options = {
    pinataMetadata: {
        name: MyCustomName,
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};
pinata.pinJSONToIPFS(body, options).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

<a name="removePinFromIPFS-anchor"></a>
### `removePinFromIPFS`
Have Pinata unpin content that you've pinned through the service.

##### `pinata.removePinFromIPFS(ipfsPinHash)`
##### Params
* `ipfsPinHash` - Valid JSON you wish to pin to IPFS
#### Response
If the operation is successful, you will simply receive "OK" as your result
##### Example Code
```javascript
pinata.removePinFromIPFS(ipfsPinHash).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

<a name="testAuthentication-anchor"></a>
### `testAuthentication`
Tests that you can authenticate with Pinata correctly

##### `pinata.testAuthentication()`
##### Params
None

#### Response
```
{
    authenticated: true
}
```

##### Example Code
```javascript
pinata.testAuthentication().then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

<a name="userPinList-anchor"></a>
### `userPinList`
Retrieve pin records for your Pinata account

##### `pinata.userPinList(filters)`
##### Params
* `filters` (optional): An object that can consist of the following optional query parameters:
  * `hashContains` (optional): A string of alphanumeric characters that desires hashes must contain
  * `pinStart` (optional): The earliest date the content is allowed to have been pinned. Must be a valid [ISO_8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) date. 
  * `pinEnd` (optional): The earliest date the content is allowed to have been pinned. Must be a valid [ISO_8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) date. 
  * `unpinStart` (optional): The earlist date the content is allowed to have been unpinned. Must be a valid [ISO_8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) date. 
  * `unpinEnd` (optional): The latest date the content is allowed to have been unpinned. Must be a valid [ISO_8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) date. 
  * `pinSizeMin` (optional): The minimum byte size that pin record you're looking for can have
  * `pinSizeMax` (optional): The maximum byte size that pin record you're looking for can have
  * `pinFilter` (optional): Filter pins using one of the following options
    * `'all'` (Records for both pinned and unpinned content will be returned)
    * `'pinned'` (Only records for pinned content will be returned)
    * `'unpinned'` (Only records for unpinned content will be returned)
  * `pageLimit` (optional): Limit the amount of results returned per page of results (default is 10, and max is 1000)
  * `pageOffset` (optional): Provide the record offset for records being returned. This is how you retrieve records on additional pages (default is 0)
   * `metadata` (optional): A JSON object that can be used to find records for content that had optional metadata included when it was added to Pinata. The metadata object is formatted as follows:
 
##### Metadata filter object formatting
```
{
    name: 'exampleName',
    keyvalues: {
        testKeyValue: {
            value: 'exampleFilterValue',
            op: 'exampleFilterOperation'
        },
        testKeyValue2: {
            value: 'exampleFilterValue2',
            op: 'exampleFilterOperation2'
        }
    }
}
```
Filter explanations:
* `name` (optional): If provided, any records returned must have a name that contains the string provided for the 'name'.
* `keyvalues` (optional): Each keyvalue provided in this object have both a `value` and `op`
  * `value` (required): This is the value which will be filtered on
  * `op` (required): This is the filter operation that will be applied to the `value` that was provided. Valid op values are:
     * `'gt'` (greater than the value provided)
     * `'gte'` (greater than or equal to the value provided)
     * `'lt'` (less than the value provided)
     * `'lte'` (less than or equal to the value provided)
     * `'ne'` (not equal to the value provided)
     * `'eq'` (equal to the value provided)
     * `'between'` (between the two values provided) - NOTE - This also requires a `secondValue` be provided as seen in the example below
     * `'notBetween'` (not between the two values provided) - NOTE - This also requires a `secondValue` be provided as seen in the example below
     * `'like'` (like the value provided)
     * `'notLike'` (not like the value provided)
     * `'iLike'` (case insensitive version of `like`)
     * `'notILike'` (case insensitive version of `notLike`)
     * `'regexp'` (filter the value provided based on a provided regular expression)
     * `'iRegexp'` (case insensitive version of regexp)
  
As an example, the following filter would only find records whose name contains the letters 'invoice', have the metadata key 'company' with a value of 'exampleCompany', and have a metadata key 'total' with values between 500 and 1000:
```
{
    name: 'invoice',
    keyvalues: {
        company: {
            value: 'exampleCompany,
            op: 'eq'
        },
        total: {
            value: 500,
            secondValue: 1000,
            op: 'between'
        }
    }
}
```


 
#### Response
```
{
    count: (this is the total number of pin records that exist for the query filters you passed in),
    rows: [
        {
            id: (the id of your pin instance record),
            ipfs_pin_hash: (the IPFS multi-hash for the content you pinned),
            size: (this is how large (in bytes) the content pinned is),
            user_id: (this is your user id for Pinata),
            date_pinned: (This is the timestamp for when this content was pinned - represented in ISO 8601 format),
            date_unpinned: (This is the timestamp for when this content was unpinned (if null, then you still have the content pinned on Pinata),
            metadata: {
                name: (this will be the name of the file originally upuloaded, or the custom name you set),
                keyvalues: {
                    exampleCustomKey: "exampleCustomValue",
                    exampleCustomKey2: "exampleCustomValue2",
                    ...
                }
            }
        },
        {
            same record format as above
        }
        .
        .
        .
    ]
}
```
##### Example Code
```javascript
const metadataFilter = {
    name: 'exampleName',
    keyvalues: {
        testKeyValue: {
            value: 'exampleFilterValue',
            op: 'exampleFilterOperation'
        },
        testKeyValue2: {
            value: 'exampleFilterValue2',
            op: 'exampleFilterOperation2'
        }
    }
};

const filters = {
    pinFilter : 'pinned',
    pageLimit: 10,
    pageOffset: 0,
    metadata: metadataFilter
};
pinata.userPinList(filters).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

<a name="userPinnedDataTotal-anchor"></a>
### `userPinnedDataTotal`
Returns the total combined size (in bytes) of all content you currently have pinned on Pinata.

##### `pinata.userPinnedDataTotal()`
##### Params
None

#### Response
The response for this call will the total combined size of everything you currently have pinned on pinata.
This value will be expressed in bytes

##### Example Code
```javascript
pinata.userPinnedDataTotal().then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
```

<a name="hostNode-anchor"></a>
## Host Node Multiaddresses
For endpoints that involve Pinata finding and pinning content that already resides on the IPFS network, you can help Pinata find your content faster by optionally providing us with the "multiaddresses" up to five host nodes that your content already resides on.

To find the multiaddresses of your nodes, simply run the following on your node's command line:
```
ipfs id
```
In the response, you'll want to focus on the "Addresses" array that's returned. Here you'll find the multiaddresses of your node. These multiaddresses are what other IPFS nodes use to connect to your node.

In the "Addresses" array, take note of the multiaddress that contains your external IP address. Not the local ipv4 "127.0.0.1" address or the local ipv6 "::1" address.

Here's an example of what a full external ipv4 multiaddress would look like (your IP address and node ID will differ):

`/ip4/123.456.78.90/tcp/4001/ipfs/QmAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQr`

⚠️ Please make sure every node provided is online. Pinata will attempt to connect to all nodes before pinning the content, and if any these nodes are offline, your request will eventually fail.

<a name="metadata-anchor"></a>

## Pinata Metadata
For endpoints that allow you to add content, Pinata lets you add optionally metadata for that content. This metadata can later be used for querying on what you've pinned with our [userPinList](#userPinList-anchor) endpoint. Providing metadata does not alter your content or how it is stored on IPFS in any way.

The metadata object can consist of the following values:
* name (optional) - A custom string to use as the name for your content
* keyvalues (optional) - An object containing up to 10 custom key / value pairs. The values can be:
  * strings
  * numbers (integers or decimals)
  * dates (provided in ISO_8601 format)
  
##### Example metadata object
```
{
    name: "customName",
    keyvalues: {
        customKey: "customValue",
        customKey2: "customValue2"
    }
}
```
<a name="pinataOptions-anchor"></a>

## Pinata Options
Some endpoints allow you to pass additional options for Pinata to take into account when adding content to IPFS.

The options object can consist of the following values:
* cidVerson (optional) - The [CID version](https://github.com/multiformats/cid#versions) IPFS will use when creating a hash for your content. Valid options are:
  * `0` - CIDv0
  * `1` - CIDv1

  
##### Example pinataOptions object
```
{
    cidVersion: 1
}
```

## Questions? Issues? Suggestions? 
Feel free to file a github issue or email us at team@pinata.cloud 

We'd love to hear from you!
