# @webiny/api-awp

[![](https://img.shields.io/npm/dw/@webiny/api-awp.svg)](https://www.npmjs.com/package/@webiny/api-awp)
[![](https://img.shields.io/npm/v/@webiny/api-awp.svg)](https://www.npmjs.com/package/@webiny/api-awp)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Install

```
npm install --save @webiny/api-awp
```

Or if you prefer yarn:

```
yarn add @webiny/api-awp
```


## Testing

To run tests api-apw tests with targeted storage operations loaded use:

#### DynamoDB
```
yarn test packages/api-apw --keyword=cms:ddb --keyword=apw:base
```

#### DynamoDB+Elasticsearch
```
yarn test packages/api-apw --keyword=cms:ddb-es --keyword=apw:base
```