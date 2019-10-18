## nest-hal
A Nest library for HAL+JSON responses

## Features
Provides easy ways to send HAL responses to ensure your API is HATEOAS compliant. Supports embeds, links and more

## Code Example
```TypeScript
@Get(":name")
@SelfLink(p => `/cats/${p.name.toLowerCase()}`)
findOne(@Param("name") name: string): CatDto {
	return this.catsService.findOne(name);
}
```
Will produce
`GET /cats/george`
```JSON
{
	"name": "George",
	"age": 5,
	"_links": {
		"self": { "href": "/cats/george" }
	}
}
```

## Installation
First you'll need to add nest-hal to your project
```bash
npm i -s nest-hal
```
or
```bash
yarn add nest-hal
```

Now, in your `main.ts` add HalInterceptor as a global interceptor (it won't change your current endpoint responses)
```TypeScript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Import it like this
import { HalInterceptor } from 'nest-hal';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// And use it this way
	app.useGlobalInterceptors(new HalInterceptor());
	await app.listen(3000);
}
bootstrap();
```
Now you're ready to rock those HAL responses

## API Reference
I'll add the full documentation soon :X

## License
(The MIT License)

Copyright (c) 2019 Gabriel Pinheiro

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

