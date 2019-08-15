---
title: typescript
date: 2019-07-18
tags:
 - typescript
categories: 
 - typescript
---

![cat](../../.vuepress/public/cat-02.png)

## 搭建 TS 开发环境

### vscode 配置

**1、编辑器配置**
有一些编辑器相关配置,需要在项目根目录下创建一个`.vscode`文件夹,然后在这个文件夹创建一个settings.json文件,编辑器的配置都放在这里,并且你还需要安装一个插件`editorConfig for vs code`这样配置才会生效。配置文件里我们来看几个简单而且使用的配置:

```json
{
  "tslint.configFile": "./tslint.json",
  "tslint.autoFixOnSave": true,
  "editor.formatOnSave": true
}
```

* `tslint.configFile`用来指定tslint.json文件的路径,注意这里是相对根目录的;
* `tslint.autoFixOnSave`设置为true则每次保存的时候编辑器会自动根据我们的tslint配置对不符合规范的代码进行自动修改;
* `tslint.formatOnSave`设为true则编辑器会对格式在保存的时候进行整理。

**2、Typescript 相关插件**
TSlint(deprecated)是一个通过 tslint.json 配置在你写 typescript 代码时，对你的代码风格进行检查和提示的插件。后面介绍如何配置。

TSlint Vue：插件用于Vue中的 ts语法语句检查

### 搭建开发环境

**安装 typescript：**

```bash
npm install -g typescript
// 项目中安装
npm install typescript
// 运行 tsc命令
tsc --init
```

项目根目录会多一个 tsconfig.json 文件, 默认开启4项配置，target, module, strict, esModuleInterop; lib配置项是代码依赖的库

```json
{
  "compilerOptions": {
    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    "lib": ["dom", "es6"],                    /* Specify library files to be included in the */
    "strict": true,                           /* Enable all strict type-checking options. */
    "esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES
  }
}
```

**安装 tslint：**

```bash
npm install -g tslint
// 运行
tslint -i
```

根目录会多一个 tslint.json 文件

```json
{
  "defaultSeverity": "error",
  "extends": [
    "tslint:recommended"
  ],
  "jsRules": {},
  "rules": {},
  "rulesDirectory": []
}
```

* `defaultSeverity`: 是提醒级别，如果为error则会报错，如果为warning则会警告，如果设为off则关闭，那TSLint就关闭了；
* `extends`: 可指定继承指定的预设配置规则；
* `jsRules`: 用来配置对 `.js | .jsx` 文件的校验，配置规则的方法和下面的rules一样；
* `rules`: 是重点了，我们要让TSLint根据怎样的规则来检查代码，都是在这个里面配置，比如当我们不允许代码中使用 `eval`方法时，就要在这里配置 "no-eval": true
* `rulesDirectory`: 可以指定规则配置文件，这里指定相对路径。

**配置 webpack：**

安装依赖

```bash
npm install webpack webpack-cli webpack-dev-server ts-loader cross-env html-webpack-plugin clean-webpack-plugin -D
```

package.json 配置

```json
"scripts": {
    "start": "cross-env NODE_ENV=development webpack-dev-server --mode=development --config webpack.config.js",
    "dev": "cross-env NODE_ENV=development webpack --mode=development --config webpack.config.js",
    "prod": "cross-env NODE_ENV=production webpack --mode=production --config webpack.config.js"
  },
```

这里用到一个插件 `cross-env` ，并且后面跟着一个参数 NODE_ENV=development，这个用来在webpack.config.js 里通过process.env.NODE_ENV 来获取当前环境

webpack.config.js

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
console.log(process.env.NODE_ENV)
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "main.js"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
  devServer: {
    contentBase: "./dist",
    stats: "errors-only",
    compress: false,
    host: "localhost",
    port: 8089
  },
  
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["./dist"]
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: 'index.html'
    })
  ]
};
```

## 类型

### 八个JS中见过的类型

1.1、布尔类型

类型为布尔型的变量的值只能是 true 和 false，如下：

```js
let bool: boolean = false;
bool = !!0;
bool = 123; // error 不能将类型“123”分配给类型“boolean”
```

1.2、数值类型

类型为布尔型的变量的值只能是 true 和 false，如下：

```js
let num: number;
num = 123;
num = 0b1111011; //  二进制的123
num = 0o173; // 八进制的123
num = 0x7b; // 十六进制的123
num = "123"; // error 不能将类型"123"分配给类型"number"
```

1.3、字符串

字符串类型可以使用单引号，双引号，模板字符串。使用tslint规则会对引号进行检测，使用单引号还是双引号可以在 tslint 中配置。

```js
let str: string = 'abc';
str = 'efg';
let str1 = 'hello';

console.log(`${str1}${str}`);
```

另外还有一个和字符串相关的类型：**字符串字面量类型**。即把一个字符串字面量作为一种类型，比如上面的字符串 'abc'，当你把一个变量指定为这个字符串类型的时候，就不能再赋值为其他的字符串值了，如：

```js
let str: "zhoujw";
str = "abc"; // 不能将类型“"abc"”分配给类型“"zhoujw"”
```

1.4、null和undefined

null 和 undefined 有一些共同的特点。在 JS 中 null 和 undefined 是两个基本数据类型；在 TS 中，null 和 undefined即是类型也是值

```js
let u: undefined = undefined; // 这里tslint会报错 Unnecessary initialization to 'undefined'
let n: null = null;
```

默认情况下 null 和 undefined 可以赋值给任意类型的变量(never 除外)。然而，当你在 tsconfig.json 的 compilerOptions里设置了 "strictNullChecks": true，null 和 undefined 只能赋值给 void类型 和它们各自。

1.5、数组

在 ts 中有两种定义数组的方式

```js
let arr: number[] = [1,2,3];
let ary: Array<number> = [1,2,3];
```

* 第一种形式通过 number[] 的形式指定这个数组的元素均为 number 类型（推荐）
* 第二种是使用数组泛型；
* 如果数组中的元素即是 number 也可以是 string 可以使用联合类型 `(number|string)[]`；
* 使用第二种方式 tslint 会报错，可以在 tslint.json 的 rules 中加入 "array-type": [false] 关闭tslint对这条的检测。

1.6、对象

```js
let obj: object = {a: 1};
obj.a = 1; // 类型“object”上不存在属性“a”
```

这里报错说 object 上没有 a 属性。如果你想要达到这种需求你应该使用接口。那么object类型什么时候使用尼？当你希望一个值必须是对象而不是数值等类型，比如函数参数，这个时候就用到了 object 类型了：

```js
function getKeys(obj: object) {
  return Object.keys(obj)
}
getKeys({a: 1}); // ['a']
```

1.7、symbol

```js
let sym: symbol = Symbol(123)
```

### TS中补充的六种类型

2.1、元组 Tuple

元组类型可以看做是数组的扩展，表示一个已知元素数量和类型的数组，各元素类型不必相同。确切的说是已知数组中每一个位置的元素类型。如下：

```js
let tuple: [number,string, number];
tuple = [1, 'a', 2];
tuple[0] = 4;
tuple[1].split(":"); // right 类型"string"拥有属性"split"
tuple[0].split(":"); // error 类型“number”上不存在属性“split”
```

上面定义了一个元组 tuple，当给元组 tuple 赋值时：各个位置上的元素类型都要对应，元素个数也要一致。

在2.6版本之前 ts 对元组的长度检验和 2.6 版本之后有所不同

```js
let tuple: [string, number];
tuple = ["a", 2]; // right 类型和个数都对应，没问题
// 2.6版本之前如下也不会报错
tuple = ["a", 2, "b"];
// 2.6版本之后如下会报错
tuple = ["a", 2, "b"]; // error 不能将类型“[string, number, string]”分配给类型“[string, number]”。 属性“length”的类型不兼容。
```

* 2.6及之前的版本中，超出规定个数的元素称作**越界元素**，但是只要越界元素的类型是定义的类型中的一种即可。
* 2.6版本后，去掉了这个越界元素是联合类型的子类型即可的条件，要求元组赋值必须类型和个数都对应。

2.6 之后的版本，[number, string] 元组类型的声明效果上可以看做等同于下面的声明：

```js
interface Tuple extends Array<number|string> {
  0: number,
  1: string,
  length: 2
}
```

如果你想要和 2.6 之前的版本一样的元组特性，可以如下定义接口：

```js
interface Tuple extends Array<number|string> {
  0: number,
  1: string
}
```

也就是去掉接口的 length 属性，这样 Tuple 接口的 length 就是从 Array 继承过来的 number类型，而不用必须是2。

2.2、枚举

`enum` 类型是对 JavaScript 标准数据类型的一个补充。 像 C# 等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

```js
enum Roles {
  SUPER_ADMIN,
  ADMIN,
  USER
}
```

上面定义了一个 enum 类型 Roles，里面有是三个值。ts 会为每个值分配编号，默认是从 0 开始，依次排列，所以它们对应的值是：

```js
enum Roles {
  SUPER_ADMIN = 0,
  ADMIN = 1,
  USER = 2
}
```

当我们使用的时候，就可以使用名字而不需要记数字和名称的对照关系了：

```js
const superAdmin = Roles.SUPER_ADMIN;
console.log(superAdmin) // 0
```

你也可以修改这个值，比如你想让这个编号从 1 开始而不是 0 ，可以如下定义：

```js
enum Roles {
  SUPER_ADMIN = 1,
  ADMIN,
  USER
}
// 当你访问 Roles.ADMIN，它的值就是 2
```

你也可以为每个值都赋予不同的、不排序列的值

```js
enum Roles {
  SUPER_ADMIN = 1,
  ADMIN = 3,
  USER = 7
}
```

**反向映射**：

我们定义一个枚举值的时候，可以通过 Enum[‘key’]或者 Enum.key 的形式获取到对应的值 value。TypeScript 还支持反向映射，但是反向映射只支持数字枚举，我们后面要讲的字符串枚举是不支持的。来看下反向映射的例子：

```js
enum Status {
  Success = 200,
  NotFound = 404,
  Error = 500
}
console.log(Status["Success"]); // 200
console.log(Status[200]); // 'Success'
console.log(Status[Status["Success"]]); // 'Success'
```

TypeScript 中定义的枚举，编译之后其实是对象，我们来看下上面这个例子中的枚举值 Status 编译后的样子：

```js
{
    200: "Success",
    404: "NotFound",
    500: "Error",
    Error: 500,
    NotFound: 404,
    Success: 200
}
```

可以看到，TypeScript 会把我们定义的枚举值的字段名分别作为对象的属性名和值，把枚举值的字段值分别作为对象的值和属性名，同时添加到对象中。这样我们既可以通过枚举值的字段名得到值，也可以通过枚举值的值得到字段名。

**字符串枚举**:

TypeScript2.4 版本新增了字符串枚举，字符串枚举值要求每个字段的值都必须是字符串字面量，或者是该枚举值中另一个字符串枚举成员，先来看个简单例子：

```js
enum Message {
  Error = "Sorry, error",
  Success = "Hoho, success"
}
console.log(Message.Error); // 'Sorry, error'
```

再来看我们使用枚举值中其他枚举成员的例子：

```js
enum Message {
  Error = "error message",
  ServerError = Error,
  ClientError = Error
}
console.log(Message.Error); // 'error message'
console.log(Message.ServerError); // 'error message'
```

注意，这里的其他枚举成员指的是同一个枚举值中的枚举成员，因为字符串枚举不能使用常量或者计算值，所以也不能使用其他枚举值中的成员。

**异构枚举**:

简单来说异构枚举就是枚举值中成员值既有数字类型又有字符串类型，如下：

```js
enum Result {
  Faild = 0,
  Success = "Success"
}
```

但是这种如果不是真的需要，不建议使用。因为往往我们将一类值整理为一个枚举值的时候，它们的特点是相似的。比如我们在做接口请求时的返回状态码，如果是状态码都是数值，如果是提示信息，都是字符串，所以在使用枚举的时候，往往是可以避免使用异构枚举的，重点是做好类型的整理。

**枚举成员类型和联合枚举类型**:

如果枚举值里所有成员的值都是字面量类型的值，那么这个枚举的每个成员和枚举值本身都可以作为类型来使用，先来看下满足条件的枚举成员的值有哪些：

* 不带初始值的枚举成员，例如:enum E { A }
* 值为字符串字面量，例如： enum E { A = ‘a’ }
* 值为数值字面量，或者带有 `-` 符号的数值字面量，例如：enum E { A = 1 }、enum E { A = -1 }

当我们的枚举值的所有成员的值都是上面这三种情况的时候，枚举值和成员就可以作为类型来用：

(1) 枚举成员类型
我们可以把符合条件的枚举值的成员作为类型来使用，来看例子：

```js
enum Animal {
  Dog = 1,
  Cat = 2
}
interface Dog {
  type: Animal.Dog; // 这里使用Animal.Dog作为类型，指定接口Dog的必须有一个type字段，且类型为Animal.Dog
}
interface Cat {
  type: Animal.Cat; // 这里同上
}
let cat1: Cat = {
  type: Animal.Dog // error [ts] 不能将类型“Animal.Dog”分配给类型“Animal.Cat”
};
let dog: Dog = {
  type: Animal.Dog
};
```

(2) 联合枚举类型
当我们的枚举值符合条件时，这个枚举值就可以看做是一个包含所有成员的联合类型，先来看例子：

```js
enum Status {
  Off,
  On
}
interface Light {
  status: Status;
}
enum Animal {
  Dog = 1,
  Cat = 2
}
const light1: Light = {
  status: Animal.Dog // error 不能将类型“Animal.Dog”分配给类型“Status”
};
const light2: Light = {
  status: Status.Off
};
const light3: Light = {
  status: Status.On
};
```

上面例子定义接口 Light 的 status 字段的类型为枚举值 Status，那么此时 status 的属性值必须为 Status.Off 和 Status.On 中的一个，也就是相当于

2.3、Any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 any 类型来标记这些变量：

```js
let notSure: any = 4
notSure = 'maybe a string instead'
notSure = false // 也可以是个 boolean
```

在对现有代码进行改写的时候，any 类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。并且当你只知道一部分数据的类型时，any 类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：

```js
let list: any[] = [1, true, 'free']
list[1] = 100
```

2.4、void

某种程度上来说，void 类型像是与 any 类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void：

```js
const warnUser = ():void => console.log(1)
```

**void 类型的变量只能赋值为 null 和 undefined，其他类型不能赋值给 void 类型的变量**。

2.5、never

`never` 类型表示的是那些永不存在的值的类型。 例如， `never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never` 类型，当它们被永不为真的类型保护所约束时。

`never` 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 `never` 的子类型或可以赋值给never 类型（除了 never 本身之外）。 即使 `any` 也不可以赋值给 `never`。

下面是一些返回 never 类型的函数：

```js
// 返回never的函数必须存在无法达到的终点
const errorFunc = (message: string):never => {
  throw new Error(message);
}

// 返回never的函数必须存在无法达到的终点
const infiniteFunc = ():never => {
  while (true) {}
}

// 推断的返回值类型为never
function fail() {
  return error("Something failed")
}
```

* 这个 errorFunc 函数总是会抛出异常，所以它的返回值类型时 never，用来表明它的返回值是永不存在的。
* infiniteFunc 也是根本不会有返回值的函数，它和之前讲 void 类型时的 consoleText 函数不同，consoleText函数没有返回值，是我们在定义函数的时候没有给它返回值，而infiniteFunc 是死循环是根本不会返回值的，所以它们二者还是有区别的。

2.6、unknown

unknown 类型是TypeScript在3.0版本新增的类型，它表示未知的类型，这样看来它貌似和any很像，但是还是有区别的，也就是所谓的“unknown相对于any是安全的”。怎么理解呢？我们知道当一个值我们不能确定它的类型的时候，可以指定它是any类型；但是当指定了any类型之后，这个值基本上是“废”了，你可以随意对它进行属性方法的访问，不管有的还是没有的，可以把它当做任意类型的值来使用，这往往会产生问题，如下：

```js
let value: any
console.log(value.name)
console.log(value.toFixed())
console.log(value.length)
```

上面这些语句都不会报错，因为value是any类型，所以后面三个操作都有合法的情况，当value是一个对象时，访问name属性是没问题的；当value是数值类型的时候，调用它的toFixed方法没问题；当value是字符串或数组时获取它的length属性是没问题的。

而当你指定值为unknown类型的时候，如果没有通过基于控制流的类型断言来缩小范围的话，是不能对它进行任何操作的，关于类型断言，我们后面小节会讲到。总之这里你知道了，unknown类型的值不是可以随便操作的。

我们这里只是先来了解unknown和any的区别，unknown还有很多复杂的规则，但是涉及到很多后面才学到的知识，所以需要我们学习了高级类型之后才能再讲解。

2.7、类型断言

虽然 TypeScript 很强大，但有时它还是不如我们了解一个值的类型，这时候我们更希望 TypeScript 不要帮我们进行类型检查，而是交给我们自己来，所以就用到了类型断言。类型断言有点像是一种类型转换，它把某个值强行指定为特定类。

类型断言有两种形式。 其一是“尖括号”语法：

```js
let someValue: any = 'this is a string';
let strLength: number = (<string>someValue).length;
```

另一个为 as 语法：（推荐）

```js
let someValue: any = 'this is a string';
let strLength = (someValue as string).length;
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在 TypeScript 里使用 JSX 时，只有 as 语法断言是被允许的。

**小结：**

* 默认情况下 null 和 undefined 可以赋值给任意类型的变量(never 除外)。开启 strictNullChecks后 undefined 只能赋值给 void类型 和它们各自。
* void 类型的变量只能赋值为 null 和 undefined，其他类型不能赋值给 void 类型的变量。
* never类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 `never` 的子类型或可以赋值给never 类型（除了 never 本身之外）。 即使 `any` 也不可以赋值给 `never`。
* 任何类型的值都可以赋值给 unknown 类型。

## 接口

### 基本用法

使用 interface 定义接口

```js
interface Info {
  firstName: string;
  lastName: string;
}

function getFullName ({firstName, lastName}: Info) {
  console.log(`${firstName} ${lastName}`);
}

getFullName({firstName: 'jw', lastName: 'zhou'});
```

### 只读属性

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 readonly 来指定只读属性:

```js
interface Role {
  readonly firstName: string;
  readonly lastName: string;
}

let role: Role = {
  firstName: 'jw',
  lastName: 'zhou'
}

role.firstName = 'jaoh' // Cannot assign to 'firstName' because it is a read-only property
```

### 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。例如给函数传入的参数对象中只有部分属性赋值了。

带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个 ? 符号。

```js
interface Square {
  color: string;
  area: number;
}

interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare (config: SquareConfig): Square {
  let square = {
    color: 'block',
    area: 100
  }
  let {color, width} = config
  if (color) square.color = color;
  if (width) square.area = Math.pow(width, 2);
  return square;
}
createSquare({color: 'red'})
```

### 多余属性检查

```js
interface SquareConfig {
  color: string;
  width?: number;
  size: number;
}
createSquare({color: 'red'}) // 'size'不在类型'SquareConfig'中
```

我们看到，传入的参数没有 width 属性，但也没有错误，因为它是可选属性。但是我们多传入了一个 size 属性，这同样会报错，TypeScript 会告诉你，接口上不存在你多余的这个属性。只要接口中没有定义这个属性，就会报错，但如果你定义了可选属性 size，那么上面的例子就不会报错。

>这里可能 tslint 会报一个警告，告诉我们属性名没有按开头字母顺序排列属性列表，如果你想关闭这条规则，可以在 tslint.json 的 rules 里添加 "object-literal-sort-keys": [false] 来关闭。

### 绕开多余属性检测

有时我们并不希望 TypeScript 这么严格地对我们的数据进行检查，比如我们只需要保证传入 createSquare 的对象有 color 属性就可以了，至于实际使用的时候传入对象有没有多余的属性，多余属性的属性值是什么类型，这些都无所谓，那就需要绕开多余属性检查，有如下三个方法：

(1) 使用类型断言

类型断言就是用来明确告诉 TypeScript，我们已经自行进行了检查，确保这个类型没有问题，希望 TypeScript 对此不进行检查，所以最简单的方式就是使用类型断言：

```js
// ...前面代码同上例
createSquare({color: 'red'} as SquareConfig)
```

(2) 添加索引签名

更好的方式是添加字符串索引签名，索引签名我们会在后面讲解，先来看怎么实现：

```js
// ... 代码省略
interface SquareConfig {
  color?: string;
  width?: number;
  [prop: string]: any;
}
// ... 代码省略
createSquare({color: 'red'})
```

表示的是SquareConfig 可以有任意数量的属性，并且只要它们不是 color 和 width，那么就无所谓它们的类型是什么。

(3) 利用类型兼容性

这种方法现在还不是很好理解，也是不推荐使用的，先来看写法：

```js
// ... 代码省略
interface SquareConfig {
  color: string;
  width?: number;
}
// ... 代码省略
let option = {color: 'red', size: 10}
createSquare(option)
```

上面这种方法完美通过检查，我们将对象字面量赋给一个变量 option，然后 createSquare 传入 option，这时没有报错。是因为直接将对象字面量传入函数，和先赋给变量再将变量传入函数，这两种检查机制是不一样的，后者是因为类型兼容性。我们后面会有专门一节来讲类型兼容性。简单地来说：如果 b 要赋值给 a，那要求 b 至少需要与 a 有相同的属性，多了无所谓。

### 函数类型

接口可以描述普通对象，还可以描述函数类型，我们先看写法：

```js
interface AddFunc {
  (num1: number, num2: number): number;
}
```

这里我们定义了一个AddFunc结构，这个结构要求实现这个结构的值，必须包含一个和结构里定义的函数一样参数、一样返回值的方法，或者这个值就是符合这个函数要求的函数。我们管花括号里包着的内容为 `调用签名`，它由带有参数类型的参数列表和返回值类型组成。后面学到 **类型别名** 一节时我们还会学习其他写法。来看下如何使用：

```js
const add: AddFunc = (n1, n2) => n1 + n2;
const join: AddFunc = (n1, n2) => `${n1} ${n2}`; // 不能将类型'string'分配给类型'number'
add("a", 2); // 类型'string'的参数不能赋给类型'number'的参数
```

上面我们定义的add函数接收两个数值类型的参数，返回的结果也是数值类型，所以没有问题。而join函数参数类型没错，但是返回的是字符串，所以会报错。而当我们调用add函数时，传入的参数如果和接口定义的类型不一致，也会报错。

你应该注意到了，实际定义函数的时候，名字是无需和接口中参数名相同的。

### 索引类型

我们可以使用接口描述索引的类型和通过索引得到的值的类型，比如一个数组，如下：

```js
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray
myArray = ['Bob', 'Fred']

let myStr: string = myArray[0]
```

你也可以给索引设置 readonly ，从而防止索引返回值被修改。

```js
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ['Alice', 'Bob'];
myArray[0] = 'Mallory'; // 类型“ReadonlyStringArray”中的索引签名仅允许读取
```

这里需要注意，如果索引类型为 number，那么实现该接口的对象的属性名必须是 number 类型；但是如果接口的索引类型是 string 类型，那么实现该接口的对象的属性名设置为数值类型的值也是可以的，因为数值最后还是会先转换为字符串。

```js
interface Inter {
  [firstName: number]: string;
}

let obj2: Inter = {
  123: 'abc'
}
let obj3: Inter = {
  '1234': 'agaf' // error
}
```

### 类类型

使用类实现接口（implements 关键字用于实现接口），用来强制一个类去符合某种契约。

```js
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date);
}

class Clock implements ClockInterface {
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

接口只是描述了类的公共部分，而不是公共（实例的属性）和私有两部分（类的属性）。ts 不会帮你检查类是否具有某些私有成员。

**类静态部分与实例部分的区别**:

当你操作类和接口的时候，你要知道类是具有两个类型的：静态部分的类型和实例的类型。 你会注意到，当你用构造器签名去定义一个接口并试图定义一个类去实现这个接口时会得到一个错误：

```js
interface ClockInterface {
  new (h: number, m: number);
}

class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
}
// 类型“Clock”提供的内容与签名“new (h: number, m: number): any”不匹配
```

这里因为当一个类实现了一个接口时，只对其实例部分进行类型检查。constructor 存在于类的静态部分，所以不在检查的范围内。

看下面的例子，我们定义了两个接口， ClockConstructor 为构造函数所用和 ClockInterface 为实例方法所用。 为了方便我们定义一个构造函数 createClock，它用传入的类型创建实例。

```js
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
  tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute)
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
    console.log('beep beep')
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
    console.log('tick tock')
  }
}

let digital = createClock(DigitalClock, 12, 17)
let analog = createClock(AnalogClock, 7, 32)
```

因为 createClock 的第一个参数是 ClockConstructor 类型，在 createClock(AnalogClock, 7, 32) 里，会检查 AnalogClock 是否符合构造函数签名。

### 继承接口

和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里

```js
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = {} as Square
square.color = 'blue'
square.sideLength = 10
```

一个接口可以继承多个接口，创建出多个接口的合成接口。

```js
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = {} as Square
square.color = 'blue'
square.sideLength = 10
square.penWidth = 5.0
```

### 混合类型

先前我们提过，接口能够描述 JavaScript 里丰富的类型。 因为 JavaScript 其动态灵活的特点，有时你会希望一个对象可以同时具有上面提到的多种类型。

```js
interface Counter {
  (): void; // 这里定义Counter这个结构必须包含一个函数，函数的要求是无参数，返回值为void，即无返回值
  count: number; // 而且这个结构还必须包含一个名为count、值的类型为number类型的属性
}
const getCounter = (): Counter => { // 这里定义一个函数用来返回这个计数器
  const c = () => { // 定义一个函数，逻辑和前面例子的一样
    c.count++;
  };
  c.count = 0; // 再给这个函数添加一个count属性初始值为0
  return c; // 最后返回这个函数对象
};
const counter: Counter = getCounter(); // 通过getCounter函数得到这个计数器
counter();
console.log(counter.count); // 1
counter();
console.log(counter.count); // 2
```

在使用 JavaScript 第三方库的时候，你可能需要像上面那样去完整地定义类型。这门课要重构的 axios 库就是一个很好的例子。

### 接口继承类

接口可以继承一个类，当接口继承了该类后，会继承类的成员，但是不包括其实现，也就是只继承成员以及成员类型。接口还会继承类的private 和 protected 修饰的成员，当接口继承的这个类中包含这两个修饰符修饰的成员时，这个接口只可被这个类或他的子类实现。

当你有一个庞大的继承结构时这很有用，但要指出的是你的代码只在子类拥有特定属性时起作用。 这个子类除了继承至基类外与基类没有任何关系。例：

```js
class A {
  protected name: string;
}
interface I extends A {}
class B implements I {} // error Property 'name' is missing in type 'B' but required in type 'I'
class C implements I {
  // error 属性“name”受保护，但类型“C”并不是从“A”派生的类
  name: string;
}
class D extends A implements I {
  getName() {
    return this.name;
  }
}
```

## 类

### 基础使用

```js
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  getPosition() {
    return `(${this.x}, ${this.y})`;
  }
}
const point = new Point(1, 2);
```

我们首先在定义类的代码块的顶部定义两个实例属性，并且指定类型为 number 类型。构造函数 constructor 需要传入两个参数，都是 number 类型，并且把这两个参数分别赋值给两个实例属性。最后定义了一个定义在类的原型对象上的方法 getPosition。

同样你也可以使用继承来复用一些特性：

```js
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`)
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name)
  }
  move(distance: number = 5) {
    console.log('Slithering...')
    super.move(distance)
  }
}

class Horse extends Animal {
  constructor(name: string) {
    super(name)
  }
  move(distance: number = 45) {
    console.log('Galloping...')
    super.move(distance)
  }
}

let sam = new Snake('Sammy')
let tom: Animal = new Horse('Tommy')

sam.move()
tom.move(34)
```

与前一个例子的不同点是，派生类包含了一个构造函数，它 必须调用 super()，它会执行基类的构造函数。 而且，在构造函数里访问 this 的属性之前，我们 一定要调用 super()。 这个是 TypeScript 强制执行的一条重要规则。

tom 被声明为 Animal 类型，但因为它的值是 Horse，调用 tom.move(34) 时，它会调用 Horse 里重写的方法。

### 修饰符

在 ES6 标准类的定义中，默认情况下，定义在实例的属性和方法会在创建实例后添加到实例上；而如果是定义在类里没有定义在 this 上的方法，实例可以继承这个方法；而如果使用 static 修饰符定义的属性和方法，是静态属性和静态方法，实例是没法访问和继承到的；我们还通过一些手段，实现了私有方法，但是私有属性的实现还不好实现。

#### public

public 表示公共的，用来指定在创建实例后可以通过实例访问的，也就是类定义的外部可以访问的属性和方法。默认是 public，但是 TSLint 可能会要求你必须用修饰符来表明这个属性或方法是什么类型的。

```js
class Animal {
  public name: string
  public constructor(name: string) {
    this.name = name
  }
  public move(distance: number) {
    console.log(`${this.name} moved ${distance}m.`)
  }
}
```

#### private

private 修饰符表示私有的，它修饰的属性在类的定义外面是没法访问的：

```js
class Parent {
  private age: number;
  constructor(age: number) {
    this.age = age;
  }
}
const p = new Parent(18);
console.log(p); // { age: 18 }
console.log(p.age); // error 属性“age”为私有属性，只能在类“Parent”中访问
console.log(Parent.age); // error 类型“typeof ParentA”上不存在属性“age”
class Child extends Parent {
  constructor(age: number) {
    super(age);
    console.log(super.age); // 通过 "super" 关键字只能访问基类的公共方法和受保护方法
  }
}
```

#### protected

protected 修饰符与 private 修饰符的行为很相似，但有一点不同，protected成员在派生类中仍然可以访问。例如：

```js
class Person {
  protected name: string
  constructor(name: string) {
    this.name = name
  }
}

class Employee extends Person {
  private department: string

  constructor(name: string, department: string) {
    super(name)
    this.department = department
  }
  
  getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`
  }
}

let howard = new Employee('Howard', 'Sales')
console.log(howard.getElevatorPitch())
console.log(howard.name) // error
```

注意，我们不能在 Person 类外使用 name，但是我们仍然可以通过 Employee 类的实例方法访问，因为 Employee 是由 Person 派生而来的。

构造函数也可以被标记成 protected。 这意味着这个类不能在包含它的类外被实例化，但是能被继承。比如：

```js
class Person {
  protected name: string
  protected constructor(name: string) {
    this.name = name
  }
}

// Employee 能够继承 Person
class Employee extends Person {
  private department: string

  constructor(name: string, department: string) {
    super(name)
    this.department = department
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`
  }
}

let howard = new Employee('Howard', 'Sales')
let john = new Person('John') // 错误: 'Person' 的构造函数是被保护的.
```

#### readonly

你可以使用 readonly 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

```js
class UserInfo {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
}
const user = new UserInfo("zhoujw");
user.name = "haha"; // error Cannot assign to 'name' because it is a read-only property
```

设置为只读的属性，实例只能读取这个属性值，但不能修改。

### 参数属性

之前的例子中，我们都是在类的定义的顶部初始化实例属性，在 constructor 里接收参数然后对实力属性进行赋值，我们可以使用 `参数属性` 来简化这个过程。参数属性简单来说就是在 constructor 构造函数的参数前面加上访问限定符，也就是前面讲的 public、private、protected 和 readonly 中的任意一个，我们来看例子：

```js
class A {
  constructor(name: string) {}
}
const a = new A("aaa");
console.log(a.name); // error 类型“A”上不存在属性“name”
class B {
  constructor(public name: string) {}
}
const b = new B("bbb");
console.log(b.name); // "bbb"
```

可以看到，在定义类 B 时，构造函数有一个参数 name，这个 name 使用访问修饰符 public 修饰，此时即为 name 声明了参数属性，也就无需再显示地在类中初始化这个属性了。

### 静态属性

和 ES6 的类一样，在 TS 中一样使用 `static` 关键字来指定属性或方法是静态的，实例将不会添加这个静态属性，也不会继承这个静态方法，你可以使用修饰符和 static 关键字来指定一个属性或方法：

```js
class Parent {
  public static age: number = 18;
  public static getAge() {
    return Parent.age;
  }
  constructor() {
    //
  }
}
const p = new Parent();
console.log(p.age); // error Property 'age' is a static member of type 'Parent'
console.log(Parent.age); // 18
```

如果使用了 private 修饰道理和之前的一样：

```js
class Parent {
  public static getAge() {
    return Parent.age;
  }
  private static age: number = 18;
  constructor() {
    //
  }
}
const p = new Parent();
console.log(p.age); // error Property 'age' is a static member of type 'Parent'
console.log(Parent.age); // error 属性“age”为私有属性，只能在类“Parent”中访问。
```

### 可选属性

TS 在 2.0 版本，支持可选类属性，也是使用 `?` 符号来标记，来看例子：

```js
class Info {
  constructor(public name: string, public age?: number) {
    this.name = name;
    this.age = age;
  }
}

let info1 = new Info('jw');
let info2 = new Info('jw', 18);
```

### 存取器

这个也就 ES6 标准中的存值函数和取值函数，也就是在设置属性值的时候调用的函数，和在访问属性值的时候调用的函数，用法和写法和 ES6 的没有区别：

```js
class Info {
  constructor(private fullName: string) {
    this.fullName = fullName;
  }

  get getFullName() {
    return this.fullName;
  }

  set setFullName(fullName: string) {
    this.fullName = fullName;
  }
}

let user = new Info('jw zhou');
console.log(user.getFullName);
user.setFullName = 'jw z';
console.log(user.getFullName);
```

使用 get 和 set 在类外部对 private 和 protected 修饰的属性进行操作。

### 抽象类

抽象类一般用来被其他类继承，而不直接用它创建实例。抽象类和类内部定义抽象方法，使用 `abstract` 关键字，我们先来看个例子：

```js
abstract class People {
  constructor(public name: string) {
    this.name = name;
  }
  public abstract printName(): void;
}

class Man extends People {
  constructor(name: string) {
    super(name);
  }
  public printName() {
    console.log(this.name);
  }
}
const man = new Man('jw');
man.printName(); // 'jw'
const p = new People("z"); // error 无法创建抽象类的实例
```

在抽象类里定义的抽象方法，在子类中是不会继承的，所以在子类中必须实现该方法的定义。

2.0 版本开始，abstract 关键字不仅可以标记类和类里面的方法，还可以标记类中定义的属性和存取器：

```js
abstract class People {
  abstract _name: string;
  abstract get insideName(): string;
  abstract set insideName(value: string);
}
class Pp extends People {
  _name: string;
  insideName: string;
}
```

但是要记住，抽象方法和抽象存取器都不能包含实际的代码块。

### 实例类型

当我们定义一个类，并创建实例后，这个实例的类型就是创建他的类.

当然了，创建实例的时候这指定 p 的类型为 People 并不是必须的，TS 会推断出他的类型。虽然指定了类型，但是当我们再定义一个和 People 类同样实现的类 Animal，并且创建实例赋值给 p 的时候，是没有问题的：

```js
class People {
  constructor(public name: string) {}
}
class Animal {
  constructor(public name: string) {}
}
let p: People = new People("jw");
p = new Animal("lark");
```

所以，如果你想实现对创建实例的类的判断，还是需要用到 instanceof。

### 类注意点

* 构造函数被 protected 修饰，不能实例化；
* 实例上的属性必须在类最顶部先定义或者使用参数属性（构造函数参数用 public，private，protected修饰），才能对其赋值；
* 抽象类用来被其他类继承，不能直接创建实例；
* 抽象类的抽象方法和抽象存取器不能包含代码块；
* 子类需要实现抽象类中抽象属性和抽象方法。

## 函数

### 函数类型

#### 定义函数

```js
function add(arg1: number, arg2: number): number {
  return x + y;
}
// 或者
const add = (arg1: number, arg2: number): number => {
  return x + y;
};
```

如果在这里省略参数的类型，TypeScript 会默认这个参数是 any 类型；如果省略返回值的类型，如果函数无返回值，那么 TypeScript 会默认函数返回值是 void 类型；如果函数有返回值，那么 TypeScript 会根据我们定义的逻辑推断出返回类型。

#### 完整的函数类型

我们为一个函数定义类型时，完整的定义应该包括参数类型和返回值类型。上面的例子中，我们都是在定义函数的指定参数类型和返回值类型。接下来我们看下，如何定义一个完整的函数类型，以及用这个函数类型来规定一个函数定义时参数和返回值需要符合的类型。先来看例子然后再进行解释：

```js
let add: (x: number, y: number) => number;
add = (arg1: number, arg2: number): number => arg1 + arg2;
add = (arg1: string, arg2: string): string => arg1 + arg2; // error
```

上面这个例子中，我们首先定义了一个变量 add，给它指定了函数类型，也就是 (x: number, y: number) => number ，这个函数类型包含参数和返回值的类型。然后我们给 add 赋了一个实际的函数，这个函数参数类型和返回类型都和函数类型中定义的一致，所以可以赋值。后面我们又给它赋了一个新函数，而这个函数的参数类型和返回值类型都是 string 类型，这时就会报错。

函数中如果使用了函数体之外定义的变量，这个变量的类型是不体现在函数类型定义的。

#### 使用接口定义函数类型

我们在前面的小节中已经学习了接口，使用接口可以清晰地定义函数类型。还拿上面的 add 函数为例，我们为它使用接口定义函数类型：

```js
interface Add {
  (x: number, y: number): number;
}
let add: Add = (arg1: string, arg2: string): string => arg1 + arg2; // error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“Add”
```

这里我们通过接口的形式定义函数类型，这个接口 Add 定义了这个结构是一个函数，两个参数类型都是 number 类型，返回值也是 number 类型。然后我们指定变量add类型为 Add 时，再要给add赋值，就必须是一个函数，且参数类型和返回值类型都要满足接口 Add，显然例子中这个函数并不满足条件，所以报错了。

#### 使用类型别名

我们可以使用类型别名来定义函数类型，类型别名我们在后面讲到 `高级类型` 的时候还会讲到。使用类型别名定义函数类型更直观易读，我们来看一下具体的写法：

```js
type Add = (x: number, y: number) => number;
let add: Add = (arg1: string, arg2: string): string => arg1 + arg2; // error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“Add”
```

使用 `type` 关键字可以为原始值、联合类型、元组以及任何我们定义的类型起一个别名。上面定义了 Add 这个别名后，Add就成为了一个和 (x: number, y: number) => number 一致的类型定义。例子中定义了 Add 类型，指定add类型为Add，但是给add赋的值并不满足 Add 类型要求，所以报错了。

### 参数

#### 可选参数

在 TS 中传递给一个函数的参数个数必须与函数期望的参数个数一致。

```js
type BuildName = (firstName: string, lastName: string) => string;
let buildName: BuildName = (f: string, l: string): string => f + l;

let result1 = buildName('Bob')                  // Error, 参数过少
let result2 = buildName('Bob', 'Adams', 'Sr.');  // Error, 参数过多
let result3 = buildName('Bob', 'Adams');         // OK
```

JavaScript 里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是 undefined。 在TypeScript 里我们可以在参数名旁使用 ? 实现可选参数的功能。 比如，我们想让 lastName 是可选的：

```js
type BuildName = (firstName: string, lastName?: string) => string;
let buildName: BuildName = (f: string, l?: string): string => f + l;

let result1 = buildName('Bob');  // 现在正常了
let result2 = buildName('Bob', 'Adams', 'Sr.')  // Error, 参数过多
let result3 = buildName('Bob', 'Adams')  // OK
```

可选参数必须跟在必须参数后面。 如果上例我们想让 firstName 是可选的，那么就必须调整它们的位置，把 firstName 放在后面。

#### 默认参数

在 TypeScript 里，我们也可以为参数提供一个默认值当用户没有传递这个参数或传递的值是 undefined 时。 当我们为参数指定了默认参数的时候，TypeScript 会识别默认参数的类型；当我们在调用函数时，如果给这个带默认值的参数传了别的类型的参数则会报错：

```js
const add = (x: number, y = 2) => {
  return x + y;
};
add(1, "a"); // error 类型"string"的参数不能赋给类型"number"的参数
```

当然了，你也可以显式地给 y 设置类型：

```js
const add = (x: number, y: number = 2) => {
  return x + y;
};
```

需要注意的是可选参数不能设置默认值。

#### 剩余参数

在 TypeScript 中你可以为剩余参数指定类型，先来看例子：

```js
const handleData = (arg1: number, ...args: number[]) => {
  //
};
handleData(1, "a"); // error 类型"string"的参数不能赋给类型"number"的参数
```

### this

箭头函数能保存函数创建时的 this 值，而不是调用时的值。

```js
class Test {
  fn1 () {
    console.log(this);
  }
  fn2 = () => console.log(this);
}
const obj = new Test();
console.log(obj.fn1()); // 指向obj
console.log(obj.fn2()); // 指向obj
//差异
const fn1 = obj.fn1;
const fn2 = obj.fn2;

console.log(fn1()); // window
console.log(fn2()); // obj
```

对于对象来说，对象的属性值可以是一个函数，那么这个函数也称为方法，在方法内如果访问this，默认情况下是对这个对象的引用，this类型也就是这个对象的字面量类型，如下：

```js
let info = {
  name: 'zhoujw',
  getName () {
      return this.name // "zhoujw" 这里this的类型为 { name: string; getName(): string; }
  }
}
```

但是如果显式地指定了this的类型，那么this的类型就改变了，如下：

```js
let info = {
  name: "zhoujw",
  getName(this: { age: number }) {
    this; // 这里的this的类型是{ age: number }
  }
};
```

### 重载

TypeScript的函数重载是在类型系统层面的，是为了更好地进行类型推断。TypeScript的函数重载通过为一个函数指定多个函数类型定义，从而对函数调用的返回值进行检查。来看例子：

```js
function handleData(x: string): string[]; // 这个是重载的一部分，指定当参数类型为string时，返回值为string类型的元素构成的数组
function handleData(x: number): string; // 这个也是重载的一部分，指定当参数类型为number时，返回值类型为string
function handleData(x: any): any { // 这个就是重载的内容了，他是实体函数，不算做重载的部分
  if (typeof x === "string") {
    return x.split("");
  } else {
    return x
      .toString()
      .split("")
      .join("_");
  }
}
handleData("abc").join("_");
handleData(123).join("_"); // error 类型"string"上不存在属性"join"
handleData(false); // error 类型"boolean"的参数不能赋给类型"number"的参数。
```

首先我们使用 function 关键字定义了两个同名的函数，但不同的是，函数没有实际的函数体逻辑，而是只定义函数名、参数及参数类型以及函数的返回值类型；而第三个使用 function 定义的同名函数，是一个完整的实体函数，包含函数名、参数及参数类型、返回值类型和函数体；这三个定义组成了一个函数——完整的带有类型定义的函数，前两个 function 定义的就称为 函数重载，而第三个 function 并不算重载；

然后我们来看下匹配规则，当调用这个函数并且传入参数的时候，会从上而下在函数重载里匹配和这个参数个数和类型匹配的重载。如例子中第一个调用，传入了一个字符串"abc"，它符合第一个重载，所以它的返回值应该是一个字符串组成的数组，数组是可以调用 join 方法的，所以这里没问题；

第二个调用传入的是一个数值类型的123，从上到下匹配重载是符合第二个的，返回值应该是字符串类型。但这里拿到返回值后调用了数组方法 join ，这肯定会报错了，因为字符串无法调用这个方法；

最后调用时传入了一个布尔类型值false，匹配不到重载，所以会报错；

最后还有一点要注意的是，这里重载只能用 function 来定义，不能使用接口、类型别名等。

### 小结

1. 函数定义
   * 基本方式：直接在定义函数实体语句中，指定参数和返回值类型；
   * 接口形式：这种方式我们在讲接口的时候已经学习过了；
   * 类型别名：这种方式是比较推荐的写法，比较简洁清晰。

2. 可选参数：TypeScript中需要在该参数后面加个 ？，且可选参数必须位于必选参数后面。
3. 默认参数：这是在ES6标准中添加的语法，为函数参数指定默认参数，写法就是在参数名后面使用 = 连接默认参数，可选参数不能设置默认值
4. 剩余参数：这也是在ES6中添加的语法，可以使用 `...参数名` 来获取剩余任意多个参数，获取的是一个数组。
5. 函数重载：TypeScript中的重载是为了针对不同参数个数和类型，推断返回值类型。重载函数只能用 function 定义。

## 泛型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

使用 `<>` 来定义泛型变量。

### 基础使用

```js
const getArray = <T>(value: T, times: number = 5): T[] => {
  return new Array(times).fill(value);
};
```

我们在定义函数之前，使用 <> 符号定义了一个泛型变量 T，这个 T 在这次函数定义中就代表某一种类型，它可以是基础类型，也可以是联合类型等高级类型。定义了泛型变量之后，你在函数中任何需要指定类型的地方使用 T 都代表这一种类型。比如当我们传入 value 的类型为数值类型，那么返回的数组类型 T[] 就表示 number[] 。现在我们再来调用一下这个 getArray 函数：

```js
getArray<number[]>([1, 2], 3).forEach(item => {
  console.log(item.length);
});
getArray<number>(2, 3).forEach(item => {
  console.log(item.length); // 类型“number”上不存在属性“length”
});
```

我们在调用 getArray 的时候，在方法名后面使用 <> 传入了我们的泛型变量 T 的类型 number[] ，那么在定义 getArray 函数时使用 T 指定类型的地方，都会使用 number[] 指定。但是你也可以省略这个 <number[]> ，TypeScript 会根据你传入函数的 value 值的类型进行推断：

```js
getArray(2, 3).forEach(item => {
  console.log(item.length); // 类型“number”上不存在属性“length”
})
```

### 泛型变量

当我们使用泛型的时候，你必须在处理类型涉及到泛型的数据的时候，把这个数据当做任意类型来处理。这就意味着不是所有类型都能做的操作不能做，不是所有类型都能调用的方法不能调用。可能会有点绕口，我们来看个例子：

```js
const getLength = <T>(param: T): number => {
  return param.length; // error 类型“T”上不存在属性“length”
};
```

当我们获取一个类型为泛型的变量 param 的 length 属性值时，如果 param 的类型为数组 Array 或字符串 string 类型是没问题的，它们有 length 属性。但是如果此时传入的 param 是数值 number 类型，那这里就会有问题了。

这里的 T 并不是固定的，你可以写为 A、B 或者其他名字，而且还可以在一个函数中定义多个泛型变量。我们来看个复杂点的例子：

```js
const getArray = <T, U>(param1: T, param2: U, times: number): [T, U][] => {
  return new Array(times).fill([param1, param2]);
};
getArray(1, "a", 3).forEach(item => {
  console.log(item[0].length); // error 类型“number”上不存在属性“length”
  console.log(item[1].toFixed(2)); // error 属性“toFixed”在类型“string”上不存在
});
```

这个例子中，我们定义了两个泛型变量 T 和 U。第一个参数的类型为 T，第二个参数的类型为 U，最后函数返回一个二维数组，函数返回类型我们指定是一个元素类型为[T, U] 的数组。所以当我们调用函数，最后遍历结果时，遍历到的每个元素都是一个第一个元素是数值类型、第二个元素是字符串类型的数组。

### 泛型函数类型

我们可以定义一个泛型函数类型，还记得我们之前学习函数一节时，给一个函数定义函数类型，现在我们可以使用泛型定义函数类型：

```js
// ex1: 简单定义
const getArray: <T>(arg: T, times: number) => T[] = (arg, times) => {
  return new Array(times).fill(arg);
};
// ex2: 使用类型别名
type GetArray = <T>(arg: T, times: number) => T[];
const getArray: GetArray = <T>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg);
};
// 使用接口
interface GetArray {
  <T>(arg: T, times: number): T[];
}
const getArray: GetArray = <T>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg);
};
```

你还可以把接口中泛型变量提升到接口最外层，这样接口中所有属性和方法都能使用这个泛型变量了。我们先来看怎么用：

```js
interface GetArray<T> {
  (arg: T, times: number): T[];
  tag: T;
}
const getArray: GetArray<number> = <T>(arg: T, times: number): T[] => {
  // error 不能将类型“{ <T>(arg: T, times: number): T[]; tag: string; }”分配给类型“GetArray<number>”。
  // 属性“tag”的类型不兼容。
  return new Array(times).fill(arg);
};
getArray.tag = "a"; // 不能将类型“"a"”分配给类型“number”
getArray("a", 1); // 不能将类型“"a"”分配给类型“number”
```

上面例子中将泛型变量定义在接口最外层，所以不仅函数的类型中可以使用 T，在属性 tag 的定义中也可以使用。但在使用接口的时候，要在接口名后面明确传入一个类型，也就是这里的 `GetArray<number>`  ，那么后面的 arg 和 tag 的类型都得是 number 类型。当然了，如果你还是希望 T 可以是任何类型，你可以把 `GetArray<number>` 换成 `GetArray<any>`。

### 泛型类

泛型类看上去与泛型接口差不多。 泛型类使用（ <>）括起泛型类型，跟在类名后面。

```js
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) {
  return x + y
}
```

我们在类那节说过，类有两部分：静态部分和实例部分。 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。

### 泛型约束

当我们使用了泛型时，就意味着这个这个类型是任意类型。但在大多数情况下，我们的逻辑是对特定类型处理的。还记得我们前面讲泛型变量时举的那个例子——当访问一个泛型类型的参数的 length 属性时，会报错"类型“T”上不存在属性“length”"，是因为并不是所有类型都有 length 属性。

所以我们在这里应该对 T 有要求，那就是类型为 T 的值应该包含 length 属性。说到这个需求，你应该能想到接口的使用，我们可以使用接口定义一个对象必须有哪些属性：

```js
interface ValueWithLength {
  length: number;
}
const v: ValueWithLength = {}; // error Property 'length' is missing in type '{}' but required in type 'ValueWithLength'
```

泛型约束就是使用一个类型和 extends 对泛型进行约束，之前的例子就可以改为下面这样：

```js
interface ValueWithLength {
  length: number;
}
const getLength = <T extends ValueWithLength>(param: T): number => {
  return param.length;
};
getLength("abc"); // 3
getLength([1, 2, 3]); // 3
getLength({ length: 3 }); // 3
getLength(123); // error 类型“123”的参数不能赋给类型“ValueWithLength”的参数
```

这个例子中，泛型变量T受到约束。它必须满足接口 ValueWithLength ，也就是不管它是什么类型，但必须有一个length属性，且类型为数值类型。

### 在泛型约束中使用类型参数

当我们定义一个对象，想要对只能访问对象上存在的属性做要求时，该怎么办？先来看下这个需求是什么样子：

```js
const getProps = (object, propName) => {
  return object[propName];
};
const obj = { a: "aa", b: "bb" };
getProps(obj, "c"); // undefined
```

当我们访问这个对象的’c’属性时，这个属性是没有的。这里我们需要用到索引类型 `keyof` 结合泛型来实现对这个问题的检查。索引类型在高级类型一节会详细讲解，这里你只要知道这个例子就可以了：

```js
const getProp = <T, K extends keyof T>(object: T, propName: K) => {
  return object[propName];
};
const obj = { a: "aa", b: "bb" };
getProp(obj, "c"); // 类型“"c"”的参数不能赋给类型“"a" | "b"”的参数
```

这里我们使用让 K 来继承索引类型 keyof T，你可以理解为 keyof T 相当于一个由泛型变量T的属性名构成的联合类型，在这里 K 就被约束为了只能是"a"或"b"，所以当我们传入字符串"c"想要获取对象 obj 的属性"c"时就会报错。

## 类型推断

在一些定义中如果你没有明确指定类型，编译器会自动推断出适合的类型。

### 多类型联合

当我们定义一个数组或元组这种包含多个元素的值的时候，多个元素可以有不同的类型，这种时候 TypeScript 会将多个类型合并起来，组成一个联合类型，来看例子：

```js
let arr = [1, "a"];
arr = ["b", 2, false]; // error 不能将类型“false”分配给类型“string | number”
```

可以看到，此时的 arr 的元素被推断为 string | number ，也就是元素可以是 string 类型也可以是 number 类型，除此两种类型外的类型是不可以的。再来看个例子：

```js
let value = Math.random() * 10 > 5 ? 'abc' : 123
value = false // error 不能将类型“false”分配给类型“string | number”
```

这里我们给value赋值为一个三元操作符表达式， Math.random() * 10 的值为0-10的随机数。这里判断，如果这个随机值大于5，则赋给value的值为字符串’abc’，否则为数值123，所以最后编译器推断出的类型为联合类型 string | number ，当给它再赋值为false的时候就会报错。

### 上下文类型

我们上面讲的两个例子都是根据 = 符号右边值的类型，推断左侧值的类型。现在要讲的上下文类型则相反，它是根据左侧的类型推断右侧的一些类型，先来看例子：

```js
window.onmousedown = function(mouseEvent) {
  console.log(mouseEvent.a)  // Error
}
```

我们可以看到，表达式左侧是 window.onmousedown(鼠标按下时发生事件)，因此 TypeScript 会推断赋值表达式右侧函数的参数是事件对象，因为左侧是 mousedown 事件，所以 TypeScript 推断 mouseEvent 的类型是 MouseEvent。在回调函数中使用 mouseEvent 的时候，你可以访问鼠标事件对象的所有属性和方法，当访问不存在属性的时候，就会报错。

如果上下文类型表达式包含了明确的类型信息，上下文的类型被忽略。重写上面的例子:

```js
window.onmousedown = function(mouseEvent:any) {
  console.log(mouseEvent.clickTime)  // OK
}
```

## 高级类型

### 交叉类型

交叉类型是将多个类型合并为一个类型，使用 `&` 号定义，被&符链接的多个类型构成一个交叉类型，交叉类型具有所有类型的特性。 例如，`Person & Loggable` 同时是 `Person` 和 `Loggable`。 就是说这个类型的对象同时拥有了这两种类型的成员。如下：

```js
const merge = <T, U>(arg1: T, arg2: U): T & U => {
  let res = {} as <T & U>; // 这里指定返回值的类型兼备T和U两个类型变量代表的类型的特点
  res = Object.assign(arg1, arg2);
  return res;
};
const info1 = {
  name: "zhoujw"
};
const info2 = {
  age: 18
};
const zhoujwInfo = merge(info1, info2);

console.log(zhoujwInfo.address); // error 类型“{ name: string; } & { age: number; }”上不存在属性“address”
```

可以看到，传入的两个参数分别是带有属性 name 和 age 的两个对象，所以它俩的交叉类型要求返回的对象既有 name 属性又有 age 属性。

### 联合类型

联合类型实际是几个类型的结合，但是和交叉类型不同，联合类型是要求只要符合联合类型中任意一种类型即可，它使用 `|`  符号定义。当我们的程序具有多样性，元素类型不唯一时，即使用联合类型。

```js
const getLength = (content: string | number): number => {
  if (typeof content === "string") return content.length;
  else return content.toString().length;
};
console.log(getLength("abc")); // 3
console.log(getLength(123)); // 3
```

这里我们指定参数既可以是字符串类型也可以是数值类型，这个getLength函数的定义中，其实还涉及到一个知识点，就是类型保护，就是 typeof content === “string” ，后面进阶部分我们会学到。

## 类型保护

这个小节我们来学习类型保护，在学习前面知识的时候我们有遇到过需要告诉编译器某个值是指定类型的场景，当时我们使用的是类型断言，这一节我们来看一个不同的场景：

```js
const valueList = [123, "abc"];
const getRandomValue = () => {
  const number = Math.random() * 10; // 这里取一个[0, 10)范围内的随机值
  if (number < 5) return valueList[0]; // 如果随机数小于5则返回valueList里的第一个值，也就是123
  else return valueList[1]; // 否则返回"abc"
};
const item = getRandomValue();
if (item.length) {
  // error 类型“number”上不存在属性“length”
  console.log(item.length); // error 类型“number”上不存在属性“length”
} else {
  console.log(item.toFixed()); // error 类型“string”上不存在属性“toFixed”
}
```

下面将使用类型保护来处理这个问题。

### 自定义类型保护

```js
const valueList = [123, 'abc'];
const getRandomValue = () => {
  const value = Math.random() * 10; // 这里取一个[0, 10)范围内的随机值
  if (value < 5) { return valueList[0]; } else { return valueList[1]; } // 否则返回"abc"
};
function isString(value: number | string): value is string {
  return typeof value === 'string';
}
const item = getRandomValue();
if (isString(item)) {
  console.log(item.length); // 此时item是string类型
} else {
  console.log(item.toFixed()); // 此时item是number类型
}
```

我们看到，首先定义一个函数，函数的参数 value 就是要判断的值，在这个例子中 value 的类型可以为 number 或 string，函数的返回值类型是一个结构为 value is type 的类型谓语，value 的命名无所谓，但是谓语中的 value 名必须和参数名一致。而函数里的逻辑则用来返回一个布尔值，如果返回为 true，则表示传入的值类型为 is 后面的 type。

### typeof 类型保护

但是这样定义一个函数来用于判断类型是字符串类型，难免有些复杂，因为在 JavaScript 中，只需要在 if 的判断逻辑地方使用 typeof 关键字即可判断一个值的类型。所以在 TS 中，如果是基本类型，而不是复杂的类型判断，你可以直接使用 typeof 来做类型保护：

```js
if (typeof item === "string") {
  console.log(item.length);
} else {
  console.log(item.toFixed());
}
```

这样直接写也是可以的，效果和自定义类型保护一样。但是在 TS 中，对 typeof 的处理还有些特殊要求：

* 只能使用 `=` 和 `!` 两种形式来比较；
* typeof 只能是 number， string， boolean， symbol 四种类型。

### instanceof 类型保护

instanceof 操作符是 JS 中的元素操作符，用来检测实例是否在构造函数的原型链上。

```js
class CreateByClass1 {
  public age = 18;
  constructor() {}
}
class CreateByClass2 {
  public name = "zhoujw";
  constructor() {}
}
function getRandomItem() {
  return Math.random() < 0.5 ? new CreateByClass1() : new CreateByClass2(); // 如果随机数小于0.5就返回CreateByClass1的实例，否则返回CreateByClass2的实例
}
const item = getRandomItem();
if (item instanceof CreateByClass1) { // 这里判断item是否是CreateByClass1的实例
  console.log(item.age);
} else {
  console.log(item.name);
}
```

## 类型兼容性

我们知道JavaScript是弱类型语言，它对类型是弱校验，正因为这个特点，所以才有了TypeScript这个强类型语言系统的出现，来弥补类型检查的短板。TypeScript在实现类型强校验的同时，还要满足JavaScript灵活的特点，所以就有了类型兼容性这个概念。本小节我们就来全面学习一下TypeScript的类型兼容性。

### 函数兼容性

函数的兼容性简单总结就是如下六点：

**(1) 函数参数个数**:

函数参数个数如果要兼容，需要满足一个要求：**如果对函数 y 进行赋值，那么要求 x 中的每个参数都应在 y 中有对应，也就是 x 的参数个数小于等于 y 的参数个数**，来看例子：

```js
let x = (a: number) => 0;
let y = (b: number, c: string) => 0;
```

上面定义的两个函数，如果进行赋值的话，来看下两种情况的结果：

```js
y = x; // 没问题
```

将 x 赋值给 y 是可以的，因为如果对函数 y 进行赋值，那么要求 x 中的每个参数都应在 y 中有对应，也就是 x 的参数个数小于等于 y 的参数个数，而至于参数名是否相同是无所谓的。

```js
x = y; // error Type '(b: number, s: string) => number' is not assignable to type '(a: number) => number'
```

这个例子中，y 要赋值给 x，但是 y 的参数个数要大于 x，所以报错。

**(2)函数参数类型**:

除了参数个数，参数的类型需要对应：

```js
let x = (a: number) => 0;
let y = (b: string) => 0;
x = y; // error 不能将类型“(b: string) => number”分配给类型“(a: number) => number”。
```

我们看到 x 和 y 两个函数的参数个数和返回值都相同，只是参数类型对不上，所以也是不行的。

**(3) 函数返回值类型**:

```js
let x = (a: number): string | number => 0;
let y = (b: number) => "a";
let z = (c: number) => false;
x = y;
x = z; // 不能将类型“(c: number) => boolean”分配给类型“(a: number) => string | number”
```

**(4)剩余参数和可选参数**:

当要被赋值的函数参数中包含剩余参数（…args）时，赋值的函数可以用任意个数参数代替，但是类型需要对应。来看例子：

```js
const getNum = ( // 这里定义一个getNum函数，他有两个参数
  arr: number[], // 第一个参数是一个数组
  callback: (...args: number[]) => number // 第二个参数是一个函数，这个函数的类型要求可以传入任意多个参数，但是类型必须是数值类型，返回值必须是数值类型
): number => {
  return callback(...arr); // 这个getNum函数直接返回调用传入的第二个参数这个函数，以第一个参数这个数组作为参数的函数返回值
};
getNum(
  [1, 2],
  (...args: number[]): number => args.length // 这里传入一个函数，逻辑是返回参数的个数
);
```

剩余参数其实可以看做无数个可选参数，所以在兼容性方面是差不多的，我们来看个可选参数和剩余参数结合的例子：

```js
const getNum = (
  arr: number[],
  callback: (arg1: number, arg2?: number) => number // 这里指定第二个参数callback是一个函数，函数的第二个参数为可选参数
): number => {
  return callback(...arr); // error 应有 1-2 个参数，但获得的数量大于等于 0
};
```

这里因为arr可能为空数组或不为空，如果为空数组则…arr不会给callback传入任何实际参数，所以这里报错。如果我们换成 return callback(arr[0], …arr) 就没问题了。

**(5) 函数参数双向协变**:

函数参数双向协变即参数类型无需绝对相同，来看个例子：

```js
let funcA = function(arg: number | string): void {};
let funcB = function(arg: number): void {};
// funcA = funcB 和 funcB = funcA都可以
```

在这个例子中，funcA 和 funcB 的参数类型并不完全一样，funcA 的参数类型为一个联合类型 number | string，而 funcB 的参数类型为 number | string 中的 number，他们两个函数也是兼容的。

**(6) 函数重载**:

带有重载的函数，要求被赋值的函数的每个重载都能在用来赋值的函数上找到对应的签名，来看例子：

```js
function merge(arg1: number, arg2: number): number; // 这是merge函数重载的一部分
function merge(arg1: string, arg2: string): string; // 这也是merge函数重载的一部分
function merge(arg1: any, arg2: any) { // 这是merge函数实体
  return arg1 + arg2;
}
function sum(arg1: number, arg2: number): number; // 这是sum函数重载的一部分
function sum(arg1: any, arg2: any): any { // 这是sum函数实体
  return arg1 + arg2;
}
let func = merge;
func = sum; // error 不能将类型“(arg1: number, arg2: number) => number”分配给类型“{ (arg1: number, arg2: number): number; (arg1: string, arg2: string): string; }”
```

上面例子中，sum函数的重载缺少参数都为string返回值为string的情况，与merge函数不兼容，所以赋值时会报错。

### 枚举

数字枚举成员类型与数值类型互相兼容，来看例子：

```js
enum Status {
  On,
  Off
}
let s = Status.On;
s = 1;
s = 3;
```

虽然Status.On的值是0，但是这里数字枚举成员类型和数值类型互相兼容，所以这里给s赋值为3也没问题。

但是不同枚举值之间是不兼容的：

```js
enum Status {
  On,
  Off
}
enum Color {
  White,
  Black
}
let s = Status.On;
s = Color.White; // error Type 'Color.White' is not assignable to type 'Status'
```

可以看到，虽然 Status.On 和 Color.White 的值都是 0，但它们是不兼容的。

字符串枚举成员类型和字符串类型是不兼容的，来看例子：

```js
enum Status {
  On = 'on',
  Off = 'off'
}
let s = Status.On
s = 'jw' // error 不能将类型“"jw"”分配给类型“Status”
```

这里会报错，因为字符串字面量类型 'jw' 和Status.On是不兼容的。

### 类

**基本比较**：

比较两个类类型的值的兼容性时，只比较实例的成员，类的静态成员和构造函数不进行比较：

```js
class Animal {
  static age1: number
  constructor(public name: string) {let a = 1;}
}
class People {
  static age2: string
  constructor(public name: string) { let b = 'a';}
}
class Food {
  constructor(public name: number) {}
}
let a: Animal = new Animal('jw');
let p: People = new People('jw11');
let f: Food = new Food(12);
a = p; // right
a = f; // 不能将类型“Food”分配给类型“Animal”。属性“name”的类型不兼容。 不能将类型“number”分配给类型“string”
```

上面例子中，Animal类和People类都有一个age静态属性，它们都定义了实例属性name，且name的类型都是string。我们看到把类型为People的p赋值给类型为Animal的a没有问题，因为我们讲了，类类型比较兼容性时，只比较实例的成员，这两个变量虽然类型是不同的类类型，但是它们都有相同字段和类型的实例属性name，而类的静态成员是不影响兼容性的，所以它俩兼容。而类Food定义了一个实例属性name，类型为number，所以类型为Food的f与类型为Animal的a类型不兼容，不能赋值。

**类的私有成员和受保护成员**:

类的私有成员和受保护成员会影响兼容性。当检查类的实例兼容性时，如果目标（也就是要被赋值的那个值）类型（这里实例类型就是创建它的类）包含一个私有成员，那么源（也就是用来赋值的值）类型必须包含来自同一个类的这个私有成员，这就允许子类赋值给父类。先来看例子：

```js
class Parent {
  private age: number;
  constructor() {}
}
class Children extends Parent {
  constructor() {
    super();
  }
}
class Other {
  private age: number;
  constructor() {}
}

const children: Parent = new Children();
const other: Parent = new Other(); // 不能将类型“Other”分配给类型“Parent”。类型具有私有属性“age”的单独声明
```

可以看到，当指定 other 为 Parent 类类型，给 other 赋值 Other 创建的实例的时候，会报错。因为 Parent 的 age 属性是私有成员，外界是无法访问到的，所以会类型不兼容。而children的类型我们指定为了Parent类类型，然后给它赋值为Children类的实例，没有问题，是因为Children类继承Parent类，且实例属性没有差异，Parent类有私有属性age，但是因为Children类继承了Parent类，所以可以赋值。

同样，使用 protected 受保护修饰符修饰的属性，也是一样的。

### 泛型

泛型包含类型参数，这个类型参数可能是任意类型，使用时类型参数会被指定为特定的类型，而这个类型只影响使用了类型参数的部分。来看例子：

```js
interface Data<T> {}
let data1: Data<number>;
let data2: Data<string>;

data1 = data2;
```

在这个例子中，data1 和 data2 都是 Data 接口的实现，但是指定的泛型参数的类型不同，TS 是结构性类型系统，所以上面将 data2 赋值给 data1 是兼容的，因为 data2 指定了类型参数为 string 类型，但是接口里没有用到参数 T，所以传入 string 类型还是传入 number 类型并没有影响。我们再来举个例子看下：

```js
interface Data<T> {
  data: T;
}
let data1: Data<number>;
let data2: Data<string>;

data1 = data2; // error 不能将类型“Data<string>”分配给类型“Data<number>”。不能将类型“string”分配给类型“number”
```

现在结果就不一样了，赋值时报错，因为 data1 和 data2 传入的泛型参数类型不同，生成的结果结构是不兼容的。

### 小结

影响函数兼容性因数有：

* 函数参数个数： 如果对函数 y 进行赋值，那么要求 x 中的每个参数都应在 y 中有对应，也就是 x 的参数个数小于等于 y 的参数个数；
* 函数参数类型： 这一点其实和基本的赋值兼容性没差别，只不过比较的不是变量之间而是参数之间；
* 函数返回值类型： 这一点和函数参数类型的兼容性差不多，都是基础的类型比较；
* 剩余参数和可选参数： 当要被赋值的函数参数中包含剩余参数（…args）时，赋值的函数可以用任意个数参数代替，但是类型需要对应，可选参数效果相似；
* 函数参数双向协变： 即参数类型无需绝对相同；
* 函数重载： 要求被赋值的函数每个重载都能在用来赋值的函数上找到对应的签名。

枚举兼容性：

* 数字枚举成员类型与数值类型互相兼容，即原先枚举属性值是数值类型，赋值一个新的数值是兼容的；
* 不同枚举及不同枚举的属性不兼容
* 字符串枚举成员与字符串类型不兼容，即原先枚举属性值是字符串类型不兼容。

类兼容性：

* 类兼容性只比较实例属性，静态属性和构造函数不比较；
* 如果属性被 private 或 protected 修饰，除了子类外与其它类不兼容。

## 显式赋值断言

在讲解本小节的主要内容之前，我们先来补充两个关于null和undefined的知识点：

**(1) 严格模式下null和undefined赋值给其它类型值**：

当我们在 tsconfig.json 中将 strictNullChecks 设为 true 后，就不能再将 undefined 和 null 赋值给除它们自身和void 之外的任意类型值了，但有时我们确实需要给一个其它类型的值设置初始值为空，然后再进行赋值，这时我们可以自己使用联合类型来实现 null 或 undefined 赋值给其它类型：

```js
let str = "zhoujw";
str = null; // error 不能将类型“null”分配给类型“string”
let strNull: string | null = "zhoujw"; // 这里你可以简单理解为，string | null即表示既可以是string类型也可以是null类型
strNull = null; // right
strNull = undefined; // error 不能将类型“undefined”分配给类型“string | null”
```

**(2) 可选参数和可选属性**:

如果开启了 strictNullChecks，可选参数会被自动加上 |undefined，来看例子：

```js
const sum = (x: number, y?: number) => {
  return x + (y || 0);
};
sum(1, 2); // 3
sum(1); // 1
sum(1, undefined); // 1
sum(1, null); // error Argument of type 'null' is not assignable to parameter of type 'number | undefined'
```

可以根据错误信息看出，这里的参数 y 作为可选参数，它的类型就不仅是 number 类型了，它可以是 undefined，所以它的类型是联合类型 number | undefined。

TS 对可选属性和对可选参数的处理一样，可选属性的类型也会被自动加上 |undefined。

```js
interface PositionInterface {
  x: number;
  b?: number;
}
const position: PositionInterface = {
  x: 12
};
position.b = "abc"; // error
position.b = undefined; // right
position.b = null; // error
```

### 显式赋值断言

显式赋值断言的作用就是告诉编译器某个值一定不为null，这个我们在实际开发中常会用到，我们在实战章节中用到时会再次学习。

接下来我们来看显式赋值断言。当我们开启 strictNullChecks 时，有些情况下编译器是无法在我们声明一些变量前知道一个值是否是 null 的，所以我们需要使用类型断言手动指明该值不为 null。这可能不好理解，接下来我们就来看一个编译器无法推断出一个值是否是null的例子：

```js
function getSplicedStr(num: number | null): string {
  function getRes(prefix: string) { // 这里在函数getSplicedStr里定义一个函数getRes，我们最后调用getSplicedStr返回的值实际是getRes运行后的返回值
    return prefix + num.toFixed().toString(); // 这里使用参数num，num的类型为number或null，在运行前编译器是无法知道在运行时num参数的实际类型的，所以这里会报错，因为num参数可能为null
  }
  num = num || 0.1; // 但是这里进行了赋值，如果num为null则会将0.1赋给num，所以实际调用getRes的时候，getRes里的num拿到的始终不为null
  return getRes("zhoujw");
}
```

这个例子中，因为有嵌套函数，而编译器无法去除嵌套函数的 null（除非是立即调用的函数表达式），所以我们需要使用显式赋值断言，写法就是在不为 null 的值后面加个

```js
function getSplicedStr(num: number | null): string {
  function getLength(prefix: string) {
    return prefix + num!.toFixed().toString();
  }
  num = num || 0.1;
  return getLength("zhoujw");
}
```

这样编译器就知道了，num 不为 null，即便 getSplicedStr 函数在调用的时候传进来的参数是null，在 getLength函数中的 num 也不会是 null。

## 类型别名和字面量类型

### 类型别名

类型别名就是给一种类型起个别的名字，之后只要使用这个类型的地方，都可以用这个名字作为类型代替，但是它只是起了一个名字，并不是创建了一个新类型。这种感觉就像 JS 中对象的赋值，你可以把一个对象赋给一个变量，使用这个对象的地方都可以用这个变量代替，但你并不是创建了一个新对象，而是通过引用来使用这个对象。

我们来看下怎么定义类型别名，使用 `type` 关键字：

```js
// 类型别名可以使用泛型
type PositionType<T> = { x: T; y: T };
const position1: PositionType<number> = {
  x: 1,
  y: -1
};
const position2: PositionType<string> = {
  x: "right",
  y: "top"
};
```

使用类型别名时也可以在属性中引用自己：

```js
type Child<T> = {
  current: T;
  child?: Child<T>;
};
let ccc: Child<string> = {
  current: "first",
  child: {
    // error
    current: "second",
    child: {
      current: "third",
      child: "test" // 这个地方不符合type，造成最外层child处报错
    }
  }
};
```

但是要注意，只可以在对象属性中引用类型别名自己，不能直接使用，比如下面这样是不对的：

```js
type Child = Child[]; // error 类型别名“Child”循环引用自身
```

另外要注意，因为类型别名只是为其它类型起了个新名字来引用这个类型，所以当它为接口起别名时，不能使用 extends 和 implements。

接口和类型别名有时可以起到同样作用，比如下面这个例子：

```js
type Alias = {
  num: number;
};
interface Interface {
  num: number;
}
let _alias: Alias = {
  num: 123
};
let _interface: Interface = {
  num: 321
};
_alias = _interface;
```

可以看到用类型别名和接口都可以定义一个只包含 num 属性的对象类型，而且类型是兼容的。那么什么时候用类型别名，什么时候用接口呢？可以通过两点来选择：

* 当你定义的类型要用于拓展，即使用 implements 等修饰符时，用接口。
* 当无法通过接口，并且需要使用联合类型或元组类型，用类型别名。

### 字面量类型

字面量类型其实比较基础，但是它又不适合放到基本类型里讲，因为字符串字面量类型和字符串类型其实并不一样，所以接下来我们来学习两种字面量类型。

**(1) 字符串字面量类型**:

字符串字面量类型其实就是字符串常量，与字符串类型不同的是它是具体的值。

```js
type Name = "zhoujw";
const name1: Name = "test"; // error 不能将类型“"test"”分配给类型“"zhoujw"”
const name2: Name = "zhoujw";
```

你还可以使用联合类型来使用多个字符串：

```js
type Direction = "north" | "east" | "south" | "west";
function getDirectionFirstLetter(direction: Direction) {
  return direction.substr(0, 1);
}
getDirectionFirstLetter("test"); // error 类型“"test"”的参数不能赋给类型“Direction”的参数
getDirectionFirstLetter("east");
```

**(2) 数字字面量类型**:

```js
type Age = 18;
interface Info {
  name: string;
  age: Age;
}
const info: Info = {
  name: "zhoujw",
  age: 28 // error 不能将类型“28”分配给类型“18”
};
```

这里补充一个比较经典的逻辑错误，来看例子：

```js
function getValue(index: number) {
  if (index !== 0 || index !== 1) {
    // error This condition will always return 'true' since the types '0' and '1' have no overlap
    // ...
  }
}
```

这个例子中，在判断逻辑处使用了 || 符，当 index !== 0 不成立时，说明 index 就是 0，则不应该再判断 index 是否不等于 1；而如果 index !== 0 成立，那后面的判断也不会再执行；所以这个地方会报错。

## 使用可辨识联合并保证每个case都被处理

我们可以把单例类型、联合类型、类型保护和类型别名这几种类型进行合并，来创建一个叫做**可辨识联合**的高级类型，它也可称作**标签联合**或**代数数据类型**。

>所谓单例类型，你可以理解为符合**单例模式**的数据类型，比如枚举成员类型，字面量类型。

可辨识联合要求具有两个要素：

* 具有普通的单例类型属性（这个要作为辨识的特征，也是重要因素）。
* 一个类型别名，包含了那些类型的联合（即把几个类型封装为联合类型，并起一个别名）。

例子：

```js
interface Square {
  kind: "square"; // 这个就是具有辨识性的属性
  size: number;
}
interface Rectangle {
  kind: "rectangle"; // 这个就是具有辨识性的属性
  height: number;
  width: number;
}
interface Circle {
  kind: "circle"; // 这个就是具有辨识性的属性
  radius: number;
}
type Shape = Square | Rectangle | Circle; // 这里使用三个接口组成一个联合类型，并赋给一个别名Shape，组成了一个可辨识联合。
function getArea(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}
```

上面这个例子中，我们的 Shape 即可辨识联合，它是三个接口的联合，而这三个接口都有一个 kind 属性，且每个接口的 kind 属性值都不相同，能够起到标识作用。

看了上面的例子，你可以看到我们的函数内应该包含联合类型中每一个接口的 case。但是如果遗漏了，我们希望编译器应该给出提示。所以我们来看下两种完整性检查的方法：

**(1) 利用-strictnullchecks**:

我们给上面的例子加一种接口：

```js
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  height: number;
  width: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}
interface Triangle {
  kind: "triangle";
  bottom: number;
  height: number;
}
type Shape = Square | Rectangle | Circle | Triangle; // 这里我们在联合类型中新增了一个接口，但是下面的case却没有处理Triangle的情况
function getArea(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}
```

上面例子中，我们的 Shape 联合有四种接口，但函数的 switch 里只包含三个 case，这个时候编译器并没有提示任何错误，因为当传入函数的是类型是 Triangle 时，没有任何一个 case 符合，则不会有 return 语句执行，那么函数是默认返回 undefined。所以我们可以利用这个特点，结合 strictNullChecks(详见11小节) 编译选项，我们可以开启 strictNullChecks，然后让函数的返回值类型为 number，那么当返回 undefined 的时候，就会报错：

```js
function getArea(s: Shape): number {
  // error Function lacks ending return statement and return type does not include 'undefined'
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}
```

这种方法简单，但是对旧代码支持不好，因为strictNullChecks这个配置项是2.0版本才加入的，如果你使用的是低于这个版本的，这个方法并不会有效。

**(2) 使用-never-类型**:

我们在学习基本类型时学习过，当函数返回一个错误或者不可能有返回值的时候，返回值类型为 never。所以我们可以给 switch 添加一个 default 流程，当前面的 case 都不符合的时候，会执行 default 后的逻辑：

```js
function assertNever(value: never): never {
  throw new Error("Unexpected object: " + value);
}
function getArea(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
    default:
      return assertNever(s); // error 类型“Triangle”的参数不能赋给类型“never”的参数
  }
}
```

采用这种方式，需要定义一个额外的 asserNever 函数，但是这种方式不仅能够在编译阶段提示我们遗漏了判断条件，而且在运行时也会报错。

## this 类型

在 TypeScript 中，this 也是一种类型，我们先来看个计算器 Counter 的例子：

```js
class Counter {
  constructor(public count: number = 0) {}
  add(value: number) { // 定义一个相加操作的方法
    this.count += value;
    return this;
  }
  subtract(value: number) { // 定义一个相减操作的方法
    this.count -= value;
    return this;
  }
}
let counter = new Counter(10);
console.log(counter.count); // 10
counter.add(5).subtract(2);
console.log(counter.count); // 13
```

我们给 Counter 类定义几个方法，每个方法都返回 this，这个 this 即指向实例，这样我们就可以通过链式调用的形式来使用这些方法。这个是没有问题的，但是如果我们要通过类继承的形式丰富这个 Counter 类，添加一些方法，依然返回 this，然后采用链式调用的形式调用，在过去版本的 TypeScript 中是有问题的，先来看我们继承的逻辑：

```js
class PowCounter extends Counter {
  constructor(public count: number = 0) {
    super(count);
  }
  pow(value: number) { // 定义一个幂运算操作的方法
    this.count = this.count ** value;
    return this;
  }
}
let powCounter = new PowCounter(2);
powCounter
  .pow(3)
  .subtract(3)
  .add(1);
console.log(powCounter.count); // 6
```

我们定义了 PowCounter 类，它继承 Counter 类，新增了 pow 方法用来求值的幂次方。我们使用 PowCounter 创建了实例 powcounter，它的类型自然是 PowCounter，在该实例上调用继承来的 subtract 和 add 方法。如果是在过去，就会报错，因为创建实例 powcounter 的类 PowCounter 没有定义这两个方法，所以会报没有这两个方法的错误。但是在 1.7 版本中增加了 this 类型，TypeScript 会对方法返回的 this 进行判断，就不会报错了。

对于对象来说，对象的属性值可以是一个函数，那么这个函数也称为方法，在方法内如果访问this，默认情况下是对这个对象的引用，this类型也就是这个对象的字面量类型，如下：

```js
// 例3.7.1
let info = {
  name: 'Lison',
  getName () {
      return this.name // "Lison" 这里this的类型为 { name: string; getName(): string; }
  }
}
```

但是如果显式地指定了this的类型，那么this的类型就改变了，如下：

```js
// 例3.7.2
let info = {
  name: "Lison",
  getName(this: { age: number }) {
    this; // 这里的this的类型是{ age: number }
  }
};
```

如果我们在 tsconfig.json 里将 noImplicitThis 设为 true，这时候有两种不同的情况：

(1) 对象字面量具有 `ThisType<T>` 指定的类型，此时 this 的类型为 T，来看例子：

```js
type ObjectDescriptor<D, M> = { // 使用类型别名定义一个接口，这里用了泛型，两个泛型变量D和M
  data?: D; // 这里指定data为可选字段，类型为D
  // 这里指定methods为可选字段，类型为M和ThisType<D & M>组成的交叉类型；  
  // ThisType是一个内置的接口，用来在对象字面量中键入this，这里指定this的类型为D & M  
  methods?: M & ThisType<D & M>;  
}

// 这里定义一个mackObject函数，参数desc的类型为ObjectDescriptor<D, M>
function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M { 
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  // 这里通过...操作符，将data和methods里的所有属性、方法都放到了同一个对象里返回，这个对象的类型自然就      是D & M，因为他同时包含D和M两个类型的字段  
  return { ...data, ...methods } as D & M; 
}

let obj = makeObject({
  data: { x: 0, y: 0 }, // 这里data的类型就是我们上面定义ObjectDescriptor<D, M>类型中的D
  methods: { // 这里methods的类型就是我们上面定义ObjectDescriptor<D, M>类型中的M
    moveBy(dx: number, dy: number) {
      this.x += dx;  // 所以这里的this是我们通过ThisType<D & M>指定的，this的类型就是D & M
      this.y += dy;
    }
  }
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

(2) 不包含 `ThisType<T>` 指定的上下文类型，那么此时 this 具有上下文类型，也就是普通的情况。你可以试着把上面使用了 `ThisType<T>` 的例子中，`ObjectDescriptor<D, M>` 类型中指定methods的类型中的 `& ThisType<D & M>` 去掉，你会发现 moveBy 方法中 this.x 和 this.y 报错了，因为此时 this 的类型是这个对象字面量的类型。

**小结：**

本小节我们学习了this类型的相关知识，学习了在1.7版本之后，编译器对有继承行为的类中this的类型的推断。还学习了对于对象的方法中，this指向的相关知识。更多的关于this类型的知识，可以看一下这个：

* 如果该方法具有显式声明的此参数，则该参数具有该参数的类型；
* 否则，如果该方法由具有此参数的签名进行上下文类型化，则该参数具有该参数的类型；
* 否则，如果在 tsconfig.json 里将 noImplicitThis 设为 true，且包含的对象文字具有包含 `ThisType<T>` 的上下文类型，则其类型为T，例子看我们讲的第(1)小点；
* 否则，如果启用了 --noImplicitThis 并且包含的对象文字具有不包含 `ThisType<T>` 的上下文类型，则它具有上下文类型，具体看我们讲的第(2)小点；
* 否则，this 的类型为 any 任何类型。

## 索引类型

我们这里要讲的，可不是前面讲接口的时候讲的索引类型。在学习接口内容的时候，我们讲过可以指定索引的类型。而本小节我们讲的索引类型包含两个内容：**索引类型查询**和**索引访问**操作符。

### 索引类型查询操作符

`keyof` 操作符，连接一个类型，会返回一个由这个类型的所有属性名组成的联合类型。来看例子：

```js
interface Info {
  name: string;
  age: number;
}
let infoProp: keyof Info;
infoProp = "name";
infoProp = "age";
infoProp = "no"; // error 不能将类型“"no"”分配给类型“"name" | "age"”
```

通过例子可以看到，这里的 keyof Info 其实相当于 "name" | “age”。通过和泛型结合使用，TS 就可以检查使用了动态属性名的代码：

```js
function getValue<T, K extends keyof T>(obj: T, names: K[]): T[K][] { // 这里使用泛型，并且约束泛型变量K的类型是"keyof T"，也就是类型T的所有字段名组成的联合类型
  return names.map(n => obj[n]); // 指定getValue的返回值类型为T[K][]，即类型为T的值的属性值组成的数组
}
const info = {
  name: "zhoujw",
  age: 18
};
let values: string[] = getValue(info, ["name"]);
values = getValue(info, ["age"]); // error 不能将类型“number[]”分配给类型“string[]”
```

### 索引访问操作符

索引访问操作符也就是 [] ，其实和我们访问对象的某个属性值是一样的语法，但是在 TS 中它可以用来访问某个属性的类型：

```js
interface Info {
  name: string;
  age: number;
}
type NameType = Info["name"];
let name: NameType = 123; // error 不能将类型“123”分配给类型“string”
```

再来看个例子：

```js
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o[name] is of type T[K]
}
```

这个函数中，两个参数的类型分别为泛型 T 和 K，而函数的返回值类型为 T[K] ，只要函数的返回值也是这种形式，即访问参数 o 的参数 name 属性，即可。

最后我们来看个结合接口的例子：

```js
interface Obj<T> {
  [key: number]: T;
}
const key: keyof Obj<number>; // keys的类型为number
```

这里需要注意，在讲接口一节时，讲索引类型的时候我们讲过，如果索引类型为 number，那么实现该接口的对象的属性名必须是 number 类型；但是如果接口的索引类型是 string 类型，那么实现该接口的对象的属性名设置为数值类型的值也是可以的，因为数值最后还是会先转换为字符串。这里一样，如果接口的索引类型设置为 string 的话， `keyof Obj<number>` 等同于类型 number | string ：

```js
interface Obj<T> {
  [key: string]: T;
}
let key: keyof Obj<number>; // keys的类型为number | string
key = 123; // right
```

也可以使用访问操作符，获取索引签名的类型：

```js
interface Obj<T> {
  [key: string]: T;
}
const obj: Obj<number> = {
  age: 18
};
let value: Obj<number>["age"]; // value的类型是number，也就是name的属性值18的类型
```

还有一点，我们在讲后面知识的时候会遇到，就是当tsconfig.json里 strictNullChecks 设为 false时，通过 Type[keyof Type]获取到的，是除去 never & undefined & null 这三个类型之后的字段值类型组成的联合类型，来看例子：

```js
interface Type {
  a: never;
  b: never;
  c: string;
  d: number;
  e: undefined;
  f: null;
  g: object;
}
type test = Type[keyof Type];
// test的类型是string | number | object
```

这个例子中接口 Type 有几个属性，通过索引访问操作符和索引类型查询操作符可以选出类型不为 never & undefined & null 的类型。

总结：

* 索引类型查询操作符 keyof： 用来获取一个类型的所有属性名组成的联合类型；
* 索引访问操作符 []：获取某个类型定义中指定字段值的类型。

## 使用映射类型得到新的类型

### Readonly、Partial、Pick和Record

**(1) Readonly**:

TS 提供了借助旧类型创建一个新类型的方式，也就是映射类型，它可以用相同的形式去转换旧类型中每个属性。来看个例子：

```js
interface Info {
  age: number;
}
```

使用 Readonly API 创建一个新类型，新类型中的属性和旧类型中的属性相同，只是全部是只读属性。如下：

```js
interface Info {
  age: number;
}
type ReadonlyInfo = Readonly<Info>;
let info: ReadonlyInfo = {
  age: 18
};
info.age = 28; // error Cannot assign to 'age' because it is a constant or a read-only property
```

Readonly 源码如下:

```js
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
}
```

**(2) Partial**:

使用 Partial API 创建一个新类型，新类型中的属性和旧类型中的属性相同，只是全部是可选属性。如下：

```js
interface Info {
  name: string;
  age: number;
  address: string;
}
type PartialInfo = Partial<Info>;
let info: PartialInfo = {
  age: 18,
};
info.age = 20;
```

Partial 源码如下：

```js
type Partial<T> = {
  [P in keyof T]?: T[P];
}
```

注意了，我们在这里用到了一个新的操作符 in，TS 内部使用了 for … in，定义映射类型，这里涉及到三个部分：

* 类型变量，也就是上例中的 P，它就像 for…in 循环中定义的变量，用来在每次遍历中绑定当前遍历到的属性名；
* 属性名联合，也就是上例中 keyof T ，它返回对象 T 的属性名联合；
* 属性的结果类型，也就是 T[P]。

**(3) Pick**:

Pick API 用于从 类型T 中取出 一系列 K 的属性，返回一个新类型。如下：

```js
interface User {
  id: number;
  age: number;
  name: string;
}

type PickUser = Pick<User, "id" | "age">; // 相当于: type PickUser = { id: number; age: number; }
type PickUser = Pick<User, 'name'>; // 相当于: type PickUser = { name: number; }
```

官方文档的例子并不完整，我们来看完整的例子：

```js
interface Info {
  name: string;
  age: number;
  address: string;
}
const info: Info = {
  name: "zhoujw",
  age: 18,
  address: "beijing"
};
// 这里我们定义一个pick函数，用来返回一个对象中指定字段的值组成的对象
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  let res = {} as Pick<T, K>;
  keys.forEach(key => {
    res[key] = obj[key];
  });
  return res;
}
const nameAndAddress = pick(info, ["name", "address"]); // { name: 'zhoujw', address: 'beijing' }
```

Pick 源码如下：

```js
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}
```

**(4) Record**:

Record API 用来将 K 中所有的属性的值转化为 T 类型，来看例子：

```js
interface User {
  id: number;
  age: number;
  name: string;
}

type person6 = Record<'name' | 'age', string>
// person6 === {name: string; age: string}
```

完整的例子：

```js
function mapObject<K extends string | number, T, U>(
  obj: Record<K, T>,
  f: (x: T) => U
): Record<K, U> {
  let res = {} as Record<K, U>;
  for (const key in obj) {
    res[key] = f(obj[key]);
  }
  return res;
}

const names = { 0: "hello", 1: "world", 2: "bye" };
const lengths = mapObject(names, s => s.length); // { 0: 5, 1: 5, 2: 3 }
```

我们输入的对象属性值为字符串类型，输出的对象属性值为数值类型。

Record 源码如下：

```js
type Record<K extends keyof any, T> = {
  [P in K]: T;
}
```

**(5) Required**:

Required 的作用是将传入的属性变为必选项, 源码如下

```js
type Required<T> = {
  [P in keyof T]-?: T[P];
}
```

讲完这四个内置的映射类型之后，我们需要讲一个概念——同态。同态在维基百科的解释是：两个相同类型的代数结构之间的结构保持映射。这四个内置映射类型中，Readonly、Partial 和 Pick 是同态的，而 Record 不是，因为 Record 映射出的对象属性值是新的，和输入的值的属性值不同。

### 由映射类型进行推断

我们学习了使用映射类型包装一个类型的属性后，也可以进行逆向操作，也就是拆包，先来看我们的包装操作：

```js
type Proxy<T> = { // 这里定义一个映射类型，他将一个属性拆分成get/set方法
  get(): T;
  set(value: T): void;
};
type Proxify<T> = { [P in keyof T]: Proxy<T[P]> }; // 这里再定义一个映射类型，将一个对象的所有属性值类型都变为Proxy<T>处理之后的类型
function proxify<T>(obj: T): Proxify<T> { // 这里定义一个proxify函数，用来将对象中所有属性的属性值改为一个包含get和set方法的对象
  let result = {} as Proxify<T>;
  for (const key in obj) {
    result[key] = {
      get: () => obj[key],
      set: value => (obj[key] = value)
    };
  }
  return result;
}
let props = {
  name: "zhoujw",
  age: 18
};
let proxyProps = proxify(props);
console.log(proxyProps.name.get()); // "zhoujw"
proxyProps.name.set("li");
```

我们来看下这个例子，这个例子我们定义了一个函数，这个函数可以把传入的对象的每个属性的值替换为一个包含 get 和 set 两个方法的对象。最后我们获取某个值的时候，比如 name，就使用 proxyProps.name.get()方法获取它的值，使用 proxyProps.name.set()方法修改 name 的值。

接下来我们来看如何进行拆包：

```js
function unproxify<T>(t: Proxify<T>): T { // 这里我们定义一个拆包函数，其实就是利用每个属性的get方法获取到当前属性值，然后将原本是包含get和set方法的对象改为这个属性值
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get(); // 这里通过调用属性值这个对象的get方法获取到属性值，然后赋给这个属性，替换掉这个对象
  }
  return result;
}
let originalProps = unproxify(proxyProps);
```

注意这个拆包推断只适用于同态的映射类型。 如果映射类型不是同态的，那么需要给拆包函数一个明确的类型参数。

### 增加或移除特定修饰符

TS 在 2.8 版本为映射类型增加了增加或移除特定修饰符的能力，使用 + 和 - 符号作为前缀来指定增加还是删除修饰符。首先来看我们如何通过映射类型为一个接口的每个属性增加修饰符，我们这里使用+前缀：

```js
interface Info {
  name: string;
  age: number;
}
type ReadonlyInfo<T> = { +readonly [P in keyof T]+?: T[P] };
let info: ReadonlyInfo<Info> = {
  name: "zhoujw"
};
info.name = ""; // error
```

这个例子中，经过 ReadonlyInfo 创建的接口类型，属性是可选的，所以我们在定义 info 的时候没有写 age 属性也没问题，同时每个属性是只读的，所以我们修改 name 的值的时候报错。我们通过+前缀增加了 readonly 和?修饰符。当然，增加的时候，这个+前缀可以省略，也就是说，上面的写法和 type ReadonlyInfo = { readonly [P in keyof T]?: T[P] } 是一样的。我们再来看下怎么删除修饰符：

```js
interface Info {
  name: string;
  age: number;
}
type RemoveModifier<T> = { -readonly [P in keyof T]-?: T[p] };
type InfoType = RemoveModifier<Readonly<Partial<Info>>>;
let info1: InfoType = {
  // error missing "age"
  name: "zhoujw"
};
let info2: InfoType = {
  name: "zhoujw",
  age: 18
};
info2.name = ""; // right, can edit
```

这个例子我们定义了去掉修饰符的映射类型 `RemoveModifier，Readonly<Partial<Info>>` 则是返回一个既属性可选又只读的接口类型，所以 InfoType 类型则表示属性必含而且非只读。

### keyof-和映射类型在的升级

TS 在 2.9 版本中，keyof 和映射类型支持用 number 和 symbol 命名的属性，我们先来看 keyof 的例子：

```js
const stringIndex = "a";
const numberIndex = 1;
const symbolIndex = Symbol();
type Obj = {
  [stringIndex]: string;
  [numberIndex]: number;
  [symbolIndex]: symbol;
};
type keys = keyof Obj;
let key: keys = 2; // error
let key: keys = 1; // right
let key: keys = "b"; // error
let key: keys = "a"; // right
let key: keys = Symbol(); // error
let key: keys = symbolIndex; // right
```

再来看个映射类型的例子：

```js
const stringIndex = "a";
const numberIndex = 1;
const symbolIndex = Symbol();
type Obj = {
  [stringIndex]: string;
  [numberIndex]: number;
  [symbolIndex]: symbol;
};
type ReadonlyType<T> = { readonly [P in keyof T]?: T[P] };
let obj: ReadonlyType<Obj> = {
  a: "aa",
  1: 11,
  [symbolIndex]: Symbol()
};
obj.a = "bb"; // error Cannot assign to 'a' because it is a read-only property
obj[1] = 22; // error Cannot assign to '1' because it is a read-only property
obj[symbolIndex] = Symbol(); // error Cannot assign to '[symbolIndex]' because it is a read-only property
```

### 元组和数组上的映射类型

TS 在 3.1 版本中，在元组和数组上的映射类型会生成新的元组和数组，并不会创建一个新的类型，这个类型上会具有 push、pop 等数组方法和数组属性。来看例子：

```js
type MapToPromise<T> = { [K in keyof T]: Promise<T[K]> };
type Tuple = [number, string, boolean];
type promiseTuple = MapToPromise<Tuple>;
let tuple: promiseTuple = [
  new Promise((resolve, reject) => resolve(1)),
  new Promise((resolve, reject) => resolve("a")),
  new Promise((resolve, reject) => resolve(false))
];
```

这个例子中定义了一个MapToPromise映射类型。它返回一个将传入的类型的所有字段的值转为Promise，且Promise的resolve回调函数的参数类型为这个字段类型。我们定义了一个元组Tuple，元素类型分别为number、string和boolean，使用MapToPromise映射类型将这个元组类型传入，并且返回一个promiseTuple类型。当我们指定变量tuple的类型为promiseTuple后，它的三个元素类型都是一个Promise，且resolve的参数类型依次为number、string和boolean。

## unknown 类型详解

学习完交叉类型、联合类型、类型断言、映射类型、索引后，我们就可以补充一个基础类型中没有讲的知识了，就是 TS 在 3.0 版本新增的顶级类型 unknown。它相对于 any 来说是安全的。关于 unknown 类型，有如下几点需要注意，我们来逐个讲解和举例学习：

**(1) 任何类型的值都可以赋值给 unknown 类型：**

```js
let value1: unknown;
value1 = "a";
value1 = 123;
```

**(2) 如果没有类型断言或基于控制流的类型细化时 unknown 不可以赋值给其它类型，此时它只能赋值给 unknown 和 any 类型：**

```js
let value2: unknown;
let value3: string = value2; // error 不能将类型“unknown”分配给类型“string”
let value1 = value2;
```

**(3) 如果没有类型断言或基于控制流的类型细化，则不能在它上面进行任何操作：**

```js
let value4: unknown;
value4 += 1; // error 对象的类型为 "unknown"
```

**(4) unknown 与任何其它类型组成的交叉类型，最后都等于其它类型：**

```js
type type1 = unknown & string; // type1 => string
type type2 = number & unknown; // type2 => number
type type3 = unknown & unknown; // type3 => unknown
type type4 = unknown & string[]; // type4 => string[]
```

**(5) unknown 与任何其它类型组成的联合类型，都等于 unknown 类型，但只有any例外，unknown与any组成的联合类型等于any：**

```js
type type5 = string | unknown; // type5 => unknown
type type6 = any | unknown; // type6 => any
type type7 = number[] | unknown; // type7 => unknown
```

**(6) never 类型是 unknown 的子类型：**

```js
type type8 = never extends unknown ? true : false; // type8 => true
```

**(7) keyof unknown 等于类型 never：**

```js
type type9 = keyof unknown; // type9 => never
```

**(8) 只能对 unknown 进行等或不等操作，不能进行其它操作：**

```js
value1 === value2;
value1 !== value2;
value1 += value2; // error
```

**(9) unknown 类型的值不能访问其属性、作为函数调用和作为类创建实例：**

```js
let value5: unknown;
value5.age; // error
value5(); // error
new value5(); // error
```

**(10) 使用映射类型时如果遍历的是 unknown 类型，则不会映射任何属性：**

```js
type Types<T> = { [P in keyof T]: number };
type type10 = Types<any>; // type10 => { [x: string]: number }
type type11 = Types<unknown>; // type10 => {}
```

我们在实际使用中，如果有类型无法确定的情况，要尽量避免使用 any，因为 any 会丢失类型信息，一旦一个类型被指定为 any，那么在它上面进行任何操作都是合法的，所以会有意想不到的情况发生。因此如果遇到无法确定类型的情况，要先考虑使用 unknown。

## 条件类型

### 基础使用

条件类型是 TS2.8 引入的，从语法上看它像是三元操作符。它会以一个条件表达式进行类型关系检测，然后在后面两种类型中选择一个，先来看它怎么写：

```js
T extends U ? X : Y
```

这个表达式的意思是，如果 T 可以赋值给 U 类型，则是 X 类型，否则是 Y 类型。来看个实际例子：

```js
type Type<T> = T extends string | number
let index: Type<'a'> // index的类型为string
let index2: Type<false> // index2的类型为number
```

### 分布式条件类型

当待检测的类型是联合类型，则该条件类型被称为“分布式条件类型”，在实例化时会自动分发成联合类型，来看例子：

```js
type TypeName<T> = T extends any ? T : never;
type Type1 = TypeName<string | number>; // Type1的类型是string|number
```

你可能会说，既然想指定 Type1 的类型为 string|number，为什么不直接指定，而要使用条件类型？其实这只是简单的示范，条件类型可以增加灵活性，再来看个复杂点的例子，这是官方文档的例子：

```js
type TypeName<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends undefined
  ? undefined
  : T extends Function
  ? Function
  : object;
type Type1 = TypeName<() => void>; // Type1的类型是Function
type Type2 = TypeName<string[]>; // Type2的类型是object
type Type3 = TypeName<(() => void) | string[]>; // Type3的类型是object | Function
```

我们来看一个分布式条件类型的实际应用：

```js
type Diff<T, U> = T extends U ? never : T;
type Test = Diff<string | number | boolean, undefined | number>;
// Test的类型为string | boolean
```

这个例子定义的条件类型的作用就是，找出从 T 中出去 U 中存在的类型，得到剩下的类型。不过这个条件类型已经内置在 TS 中了，只不过它不叫 Diff，叫 Exclude，我们待会儿会讲到。

来看一个条件类型和映射类型结合的例子：

```js
type Type<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}
type Test = Type<Part>; // Test的类型为"updatePart"
```

来看一下，这个例子中，接口 Part 有四个字段，其中 updatePart 的值是函数，也就是 Function 类型。Type的定义中，涉及到映射类型、条件类型、索引访问类型和索引类型。首先[K in keyof T]用于遍历 T 的所有属性名，值使用了条件类型，T[K]是当前属性名的属性值，T[K] extends Function ? K : never 表示如果属性值为 Function 类型，则值为属性名字面量类型，否则为 never 类型。接下来使用 keyof T 获取 T 的属性名，最后通过索引访问类型 [keyof T] 获取不为 never 的类型。

### 条件类型的类型推断-infer

条件类型提供一个 infer 关键字用来推断类型，我们先来看个例子。我们想定义一个条件类型，如果传入的类型是一个数组，则返回它元素的类型；如果是一个普通类型，则直接返回这个类型。来看下不使用 infer 的话，怎么写：

```js
type Type<T> = T extends any[] ? T[number] : T;
type test = Type<string[]>; // test的类型为string
type test2 = Type<string>; // test2的类型为string
```

这个例子中，如果传入 Type 的是一个数组类型，那么返回的类型为 T[number] ，也就是该数组的元素类型，如果不是数组，则直接返回这个类型。这里我们是自己通过索引访问类型 T[number] 来获取类型的，如果使用 infer 关键字则无需自己手动获取，我们来看下怎么使用 infer：

```js
type Type<T> = T extends Array<infer U> ? U : T;
type test = Type<string[]>; // test的类型为string
type test2 = Type<string>; // test2的类型为string
```

这里 infer 能够推断出 U 的类型，并且供后面使用，你可以理解为这里定义了一个变量 U 来接收数组元素的类型。

### TS-预定义条件类型

TS 在 2.8 版本增加了一些预定义的有条件类型，来看一下：

* Exclude<T, U>，从 T 中去掉可以赋值给 U 的类型：
  
```js
type Type = Exclude<"a" | "b" | "c", "a" | "b">;
// Type => 'c'
type Type2 = Exclude<string | number | boolean, string | number>;
// Type2 => boolean
```

* Extract<T, U>，选取 T 中可以赋值给 U 的类型：
  
```js
type Type = Extract<"a" | "b" | "c", "a" | "c" | "f">;
// Type => 'a' | 'c'
type Type2 = Extract<number | string | boolean, string | boolean>;
// Type2 => string | boolean
```

* NonNullable，从 T 中去掉 null 和 undefined：

```js
type Type = NonNullable<string | number | undefined | null>;
// Type => string | number
```

* ReturnType，获取函数类型返回值类型：

```js
type Type = ReturnType<() => string>
// Type => string
type Type2 = ReturnType<(arg: number) => void>
// Type2 => void
```

* InstanceType，获取构造函数类型的实例类型：

InstanceType直接看例子可能不好理解，所以我们先来看下它的实现：

```js
type InstanceType<T extends new (...args: any[]) => any> = T extends new (
  ...args: any[]
) => infer R
  ? R
  : any;
```

InstanceType 条件类型要求泛型变量 T 类型是创建实例为 any 类型的构造函数，而它本身则通过判断 T 是否是构造函数类型来确定返回的类型。如果是构造函数，使用 infer 可以自动推断出 R 的类型，即实例类型；否则返回的是 any 类型。

看过 InstanceType 的实现后，我们来看怎么使用：

```js
class A {
  constructor() {}
}
type T1 = InstanceType<typeof A>; // T1的类型为A
type T2 = InstanceType<any>; // T2的类型为any
type T3 = InstanceType<never>; // T3的类型为never
type T4 = InstanceType<string>; // error
```

上面例子中，T1 的定义中， typeof A 返回的的是类 A 的类型，也就是 A，这里不能使用 A 因为它是值不是类型，类型 A 是构造函数，所以 T1 是 A 构造函数的实例类型，也就是 A；T2 传入的类型为 any，因为 any 是任何类型的子类型，所以它满足 T extends new (…args: any[]) => infer R，这里 infer 推断的 R 为 any；传入 never 和 any 同理。传入 string 时因为 string 不能不给构造函数类型，所以报错。

## 装饰器

ECMAScript 的装饰器提案到现在还没有定案，所以我们直接看 TS 中的装饰器。同样在 TS 中，装饰器仍然是一项实验性特性，未来可能有所改变，所以如果你要使用装饰器，需要在 tsconfig.json 的编译配置中开启 experimentalDecorators ，将它设为 true。

### 基础

**(1) 装饰器定义：**

装饰器是一种新的声明，它能够作用于**类声明、方法、访问符、属性和参数**上。使用 `@` 符号加一个名字来定义，如 `@decorat`，这的 decorat 必须是一个函数或者求值后是一个函数，这个 decorat 命名不是写死的，是你自己定义的，这个函数在运行的时候被调用，被装饰的声明作为参数会自动传入。要注意**装饰器要紧挨着要修饰的内容的前面**，而且所有的装饰器不能用在声明文件(.d.ts)中，和任何外部上下文中（比如 declare，关于.d.ts 和 declare，我们都会在讲声明文件一课时学习）。比如下面的这个函数，就可以作为装饰器使用：

```js
function setProp (target) {
  // ...
}
@setProp
```

先定义一个函数，然后这个函数有一个参数，就是要装饰的目标，装饰的作用不同，这个target代表的东西也不同，下面我们具体讲的时候会讲。定义了这个函数之后，它就可以作为装饰器，使用 `@函数名` 的形式，写在要装饰的内容前面。

**(2) 装饰器工厂:**

**装饰器工厂**也是一个函数，它的返回值是一个函数，返回的函数作为装饰器的调用函数。如果使用装饰器工厂，那么在使用的时候，就要加上函数调用，如下：

```js
function setProp () {
    return function (target) {
        // ...
    }
}

@setProp()
```

**(3) 装饰器组合:**

装饰器可以组合，也就是对于同一个目标，引用多个装饰器：

```js
// 可以写在一行
@setName @setAge target
// 可以换行
@setName
@setAge
target
```

但是这里要格外注意的是，多个装饰器的执行顺序：

* 装饰器工厂从上到下依次执行，但是只是用于返回函数但不调用函数；
* 装饰器函数从下到上依次执行，也就是执行工厂函数返回的函数。

```js
function setName () {
    console.log('get setName')
    return function (target) {
        console.log('setName')
    }
}
function setAge () {
    console.log('get setAge')
    return function (target) {
        console.log('setAge')
    }
}
@setName()
@setAge()
class Test {}
// 打印出来的内容如下：
/**
 'get setName'
 'get setAge'
 'setAge'
 'setName'
*/
```

可以看到，多个装饰器，会先执行装饰器工厂函数获取所有装饰器，然后再从后往前执行装饰器的逻辑。

**(4) 装饰器求值:**

类的定义中不同声明上的装饰器将按以下规定的顺序引用：

1. 参数装饰器，方法装饰器，访问符装饰器或属性装饰器应用到每个实例成员；
2. 参数装饰器，方法装饰器，访问符装饰器或属性装饰器应用到每个静态成员；
3. 参数装饰器应用到构造函数；
4. 类装饰器应用到类。

### 类装饰器

**类装饰器**在类声明之前声明，要记着装饰器要紧挨着要修饰的内容，类装饰器应用于类的声明。

类装饰器表达式会在运行时当做函数被调用，它由唯一一个参数，就是装饰的这个类。

```js
let sign = null;
function setName(name: string) {
  return function(target: Function) {
    sign = target;
    console.log(target.name);
  };
}
@setName("zhoujw") // Info
class Info {
  constructor() {}
}
console.log(sign === Info); // true
console.log(sign === Info.prototype.constructor); // true
```

可以看到，我们在装饰器里打印出类的 name 属性值，也就是类的名字，我们没有使用 Info 创建实例，控制台也打印了"Info"，因为装饰器作用与装饰的目标声明时。而且我们将装饰器里获取的参数 target 赋值给 sign，最后判断 sign 和定义的类 Info 是不是相等，如果相等说明它们是同一个对象，结果是 true。而且类 Info 的原型对象的 constructor 属性指向的其实就是 Info 本身。

通过装饰器，我们就可以修改类的原型对象和构造函数：

```js
function addName(constructor: { new (): any }) {
  constructor.prototype.name = "zhoujw";
}
@addName
class A {}
const a = new A();
console.log(a.name); // error 类型“A”上不存在属性“name”
```

上面例子中，我们通过 addName 修饰符可以在类 A 的原型对象上添加一个 name 属性，这样使用 A 创建的实例，应该可以继承这个 name 属性，访问实例对象的 name 属性应该返回"zhoujw"，但是这里报错，是因为我们定义的类 A 并没有定义属性 name，所以我们可以定义一个同名接口，通过声明合并解决这个问题：

```js
function addName(constructor: { new (): any }) {
  constructor.prototype.name = "zhoujw";
}
@addName
class A {}
interface A {
  name: string;
}
const a = new A();
console.log(a.name); // "zhoujw"
```

如果类装饰器返回一个值，那么会使用这个返回的值替换被装饰的类的声明，所以我们可以使用此特性修改类的实现。但是要注意的是，我们需要自己处理原有的原型链。我们可以通过装饰器，来覆盖类里一些操作，来看官方的这个例子：

```js
function classDecorator<T extends { new (...args: any[]): {} }>(target: T) {
  return class extends target {
    newProperty = "new property";
    hello = "override";
  };
}
@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}
console.log(new Greeter("world"));
/*
{
    hello: "override"
    newProperty: "new property"
    property: "property"
}
*/
```

首先我们定义了一个装饰器，它返回一个类，这个类继承要修饰的类，所以最后创建的实例不仅包含原 Greeter 类中定义的实例属性，还包含装饰器中定义的实例属性。还有一个点，我们在装饰器里给实例添加的属性，设置的属性值会覆盖被修饰的类里定义的实例属性，所以我们创建实例的时候虽然传入了字符串，但是 hello 还是装饰器里设置的"override"。我们把这个例子改一下：

```js
function classDecorator(target: any): any {
  return class {
    newProperty = "new property";
    hello = "override";
  };
}
@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}
console.log(new Greeter("world"));
/*
{
    hello: "override"
    newProperty: "new property"
}
*/
```

在这个例子中，我们装饰器的返回值还是返回一个类，但是这个类不继承被修饰的类了，所以最后打印出来的实例，只包含装饰器中返回的类定义的实例属性，被装饰的类的定义被替换了。

如果我们的类装饰器有返回值，但返回的不是一个构造函数（类），那就会报错了。

### 方法装饰器

方法装饰器用来处理类中方法，它可以处理方法的属性描述符，可以处理方法定义。方法装饰器在运行时也是被当做函数调用，含 3 个参数：

* 装饰静态成员时是类的构造函数，装饰实例成员时是类的原型对象；
* 成员的名字；
* 成员的属性描述符。

讲到这里，我们先补充个 JS 的知识——属性描述符。对象可以设置属性，如果属性值是函数，那这个函数称为方法。每一个属性和方法在定义的时候，都伴随三个属性描述符 configurable、writable 和 enumerable，分别用来描述这个属性的可配置性、可写性和可枚举性。这三个描述符，需要使用 ES5 才有的 Object.defineProperty 方法来设置，我们来看下如何使用：

```js
var obj = {};
Object.defineProperty(obj, "name", {
  value: "zhoujw",
  writable: false,
  configurable: true,
  enumerable: true
});
console.log(obj);
// { name: 'zhoujw' }
obj.name = "test";
console.log(obj);
// { name: 'zhoujw' }
for (let key in obj) {
  console.log(key);
}
// 'name'
Object.defineProperty(obj, "name", {
  enumerable: false
});
for (let key in obj) {
  console.log(key);
}
// 什么都没打印
Object.defineProperty(obj, "name", {
  writable: true
});
obj.name = "test";
console.log(obj);
// { name: 'test' }
Object.defineProperty(obj, "name", {
  configurable: false
});
Object.defineProperty(obj, "name", {
  writable: false
});
// error Cannot redefine property: name
```

通过这个例子，我们分别体验了这三个属性修饰符，还要一个字段是 value，用来设置属性的值。首先当我们设置 writable 为 false 时，通过给 obj.name  赋值是没法修改它起初定义的属性值的；普通的属性在 for in 等迭代器中是可以遍历到的，但是如果设置了 enumerable 为 false，即为不可枚举的，就遍历不到了；最后如果设置 configurable 为 false，那么就再也无法通过 Object.defineProperty 修改该属性的三个描述符的值了，所以这是个不可逆的设置。正是因为设置属性的属性描述符需要用 Object.defineProperty 方法，而这个方法又没法通过 ES3 的语言模拟，所以不支持 ES5 的浏览器是没法使用属性描述符的。

讲完属性描述符，就要注意方法装饰器对于属性描述符相关的一些操作了。如果代码输出目标小于 ES5，属性描述符会是 undefined。

eg:

```js
function enumerable(bool: boolean) {
  return function(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(target); // { getAge: f, constructor: f }
    descriptor.enumerable = bool;
  };
}
class Info {
  constructor(public age: number) {}
  @enumerable(false)
  getAge() {
    return this.age;
  }
}
const info = new Info(18);
console.log(info);
// { age: 18 }
for (let propertyName in info) {
  console.log(propertyName);
}
// "age"
```

这个例子中通过我们定义了一个方法装饰器工厂，装饰器工厂返回一个装饰器；因为这个装饰器修饰在下面使用的时候修饰的是实例(或者实例继承的)的方法，所以装饰器的第一个参数是类的原型对象；第二个参数是这个方法名；第三个参数是这个属性的属性描述符的对象，可以直接通过设置这个对象上包含的属性描述符的值，来控制这个属性的行为。我们这里定义的这个方法装饰器，通过传入装饰器工厂的一个布尔值，来设置这个装饰器修饰的方法的可枚举性。如果去掉@enumerable(false)，那么最后 for in 循环打印的结果，会既有"age"又有"getAge"。

如果方法装饰器返回一个值，那么会用这个值作为方法的属性描述符对象：

```js
function enumerable(bool: boolean): any {
  return function(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    return {
      value: function() {
        return "not age";
      },
      enumerable: bool
    };
  };
}
class Info {
  constructor(public age: number) {}
  @enumerable(false)
  getAge() {
    return this.age;
  }
}
const info = new Info();
console.log(info.getAge()); // "not age"
```

我们在这个例子中，在方法装饰器中返回一个对象，对象中包含 value 用来修改方法，enumerable 用来设置可枚举性。我们可以看到最后打印出的 info.getAge()的结果为"not age"，说明我们成功使用 function () { return “not age” } 替换了被装饰的方法 getAge () { return this.age }

注意，当构建目标小于 ES5 的时候，方法装饰器的返回值会被忽略。

### 访问器装饰器

访问器也就是我们之前讲过的 set 和 get 方法，一个在设置属性值的时候触发，一个在获取属性值的时候触发。

首先要注意一点的是，TS 不允许同时装饰一个成员的 get 和 set 访问器，只需要这个成员 get/set 访问器中定义在前面的一个即可。

访问器装饰器也有三个参数，和方法装饰器是一模一样的，这里就不再重复列了。来看例子：

```js
function enumerable(bool: boolean) {
  return function(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = bool;
  };
}
class Info {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }
  @enumerable(false)
  get name() {
    return this._name;
  }
  @enumerable(false) // error 不能向多个同名的 get/set 访问器应用修饰器
  set name(name) {
    this._name = name;
  }
}
```

这里我们同时给 name 属性的 set 和 get 访问器使用了装饰器，所以在给定义在后面的 set 访问器使用装饰器时就会报错。经过 enumerable 访问器装饰器的处理后，name 属性变为了不可枚举属性。同样的，如果访问器装饰器有返回值，这个值会被作为属性的属性描述符。

### 属性装饰器

属性装饰器声明在属性声明之前，它有 2 个参数，和方法装饰器的前两个参数是一模一样的。属性装饰器没法操作属性的属性描述符，它只能用来判断某各类中是否声明了某个名字的属性。

```js
function printPropertyName(target: any, propertyName: string) {
  console.log(propertyName);
}
class Info {
  @printPropertyName
  name: string;
  @printPropertyName
  age: number;
}
```

### 参数装饰器

参数装饰器有 3 个参数，前两个和方法装饰器的前两个参数一模一样：

* 装饰静态成员时是类的构造函数，装饰实例成员时是类的原型对象；
* 成员的名字；
* 参数在函数参数列表中的索引。

参数装饰器的返回值会被忽略，来看下面的例子：

```js
function required(target: any, propertName: string, index: number) {
  console.log(`修饰的是${propertName}的第${index + 1}个参数`);
}
class Info {
  name: string = "zhoujw";
  age: number = 18;
  getInfo(prefix: string, @required infoType: string): any {
    return prefix + " " + this[infoType];
  }
}
interface Info {
  [key: string]: string | number | Function;
}
const info = new Info();
info.getInfo("hihi", "age"); // 修饰的是getInfo的第2个参数
```

这里我们在 getInfo 方法的第二个参数之前使用参数装饰器，从而可以在装饰器中获取到一些信息。

## 使用模块封装代码

TypeScript 在 1.5 版本之前，有内部模块和外部模块的概念，从 1.5 版本开始，内部模块改称作命名空间外部模块改称为模块。 TypeScript 中的模块系统是遵循 ES6 标准的。

### export

TypeScript 中，仍然使用 export 来导出声明，而且能够导出的不仅有变量、函数、类，还包括 TypeScript 特有的类型别名和接口。

```js
// funcInterface.ts
export interface Func {
  (arg: number): string;
}
export class C {
  constructor() {}
}
class B {}
export { B };
export { B as ClassB };
```

上面例子中，你可以使用 export 直接导出一个声明，也可以先声明一个类或者其它内容，然后使用 export {}的形式导出，也可以使用 as 来为导出的接口换个名字再导出一次。

你也可以像 ES6 模块那样重新导出一个模块，也就是 export 一个引入内容，也可以重新导出部分内容，也可以重命名重新导出：

```js
// main.ts
export * from "./moduleB";
// main.ts
export { name } from "./moduleB";
// main.ts
export { name as nameProp } from "./moduleB";
```

### import

接下来我们来看导出的模块怎么引入，依然是使用 import：

```js
// main.ts
import { name } from "./moduleB";
// main.ts
import * as info from "./moduleB";
//main.ts
import { name as nameProp } from "./moduleB";
```

同样，可以使用 import 直接接模块名或文件路径，进行具有副作用的导入：

```js
import "./set-title.ts";
```

### export-default

同样在 TypeScript 中使用 export default 默认导出，这个和 ES6 一样：

```js
// moduleB.ts
export default "zhoujw";
// main.ts
import name from "./moduleB.ts";
console.log(name); // 'zhoujw'
```

### export = 和 import = require()

TypeScript可以将代码编译为CommonJS、AMD或其它模块系统代码，同时会生成对应的声明文件。我们知道CommonJS和AMD两种模块系统语法是不兼容的，所以TypeScript为了兼容这两种语法，使得我们编译后的声明文件同时支持这两种模块系统，增加了 `export =` 和`import xx = require()`两个语句。

```js
// moduleC.ts
class C {}
export = C;
```

然后使用这个形式导出的模块，必须使用import xx = require()来引入：

```js
// main.ts
import ClassC = require("./moduleC");
const c = new ClassC();
```

如果你的模块不需要同时支持这两种模块系统，可以不使用 export = 来导出内容。

### 模块解析策略

假如需要加载模块 ../module/moduleB.ts，如果省略后缀名查找策略如下：

1. 依次查找以该名称为文件名的.ts、.tsx、.d.ts文件；
2. 如果没找到，会在当前文件夹下的 package.json 文件里查找 types 字段指定的模块路径，然后通过这个路径去查找模块；
3. 如果没找到package.json文件或者types字段，则会将 moduleB 当做文件夹去查找，
4. 如果它确实是文件夹，将会在这个文件夹下依次查找 index.ts、index.tsx、index.d.ts。
5. 如果还没找到，会在上面例子中 module 文件夹的上级文件夹继续查找，查找规则和前面这些顺序一致。

## 使用命名空间封装代码

1.5 版本开始，使用“命名空间”代替“内部模块”说法，并且使用 namespace 来定义。

命名空间的作用与使用场景和模块还是有区别的：

* 当我们是在程序内部用于防止全局污染，想把相关的内容都放在一起的时候，使用命名空间；
* 当我们封装了一个工具或者库，要适用于模块系统中引入使用时，适合使用模块。

### 定义和使用

命名空间的定义实际相当于定义了一个大的对象，里面可以定义变量、接口、类、方法等等，但是如果不使用 export  关键字指定此内容要对外可见的话，外部是没法访问到的。来看下怎么写，我们想要把所有涉及到内容验证的方法都放到一起，文件名叫 validation.ts：

```js
namespace Validation {
  const isLetterReg = /^[A-Za-z]+$/; // 这里定义一个正则
  export const isNumberReg = /^[0-9]+$/; // 这里再定义一个正则，与isLetterReg的区别在于他使用export导出了
  export const checkLetter = (text: any) => {
    return isLetterReg.test(text);
  };
}
```

我们创建了一个命名空间叫做 Validation，它里面定义了三个内容，两个正则表达式，但是区别在于 isLetterReg 没有使用 export 修饰，而 isNumberReg 使用了 export 修饰。最后一个函数，也是用了 export 修饰。

这里要说明一点的是，命名空间在引入的时候，如果是使用 tsc 命令行编译文件，比如是在 index.ts 文件使用这个命名空间，先直接像下面这样写：

```js
/// <reference path="validation.ts"/>
let isLetter = Validation.checkLetter("sdfsd");
const reg = Validation.isNumberReg;
console.log(isLetter);
console.log(reg);
```

来解释下，命名空间如果不是使用 webpack 等工具编译，而是使用 tsc 编译，那只需要在使用外部命名空间的地方使用 `/// <reference path=“namespace.ts”/>` 来引入，注意三斜线 ”///“ 开头，然后在 path 属性指定相对于当前文件，这个命名空间文件的路径。然后编译时，需要指定一个参数 outFile ，这个参数来制定输出的文件名：

```js
tsc --outFile src/index.js src/index.ts
```

–outFile 用来指定输出的文件路径和文件名，最后指定要编译的文件。还有一点要注意，使用 outFile 只支持 amd 和 system 两种模块标准，所以需要在 tsconfig.json 里，设置 module 编译选项。

来看下编译后的文件 index.js：

```js
var Validation;
(function(Validation) {
  var isLetterReg = /^[A-Za-z]+$/;
  Validation.isNumberReg = /^[0-9]+$/;
  Validation.checkLetter = function(text) {
    return isLetterReg.test(text);
  };
})(Validation || (Validation = {}));
/// <reference path="namespace.ts"/>
var isLetter = Validation.checkLetter("sdfsd");
var reg = Validation.isNumberReg;
console.log(isLetter);
console.log(reg);
```

可以看到，编译后的 JS 文件将命名空间定义的文件 Validation.ts 文件的内容和 index.ts 的内容合并到了最后输出的文件。

如果我们要在 webpack 等工具中开发项目，并时时运行，如果只通过`/// <reference path=“Validation.ts”/>`来引入命名空间，你会发现运行起来之后，浏览器控制台会报 **Validation is not defined** 的错误。所以如果是要在项目中时时使用，需要使用 export 将命名空间导出，其实就是作为模块导出，然后在 index.ts 中引入，先来看 Validation.ts 文件：

```js
export namespace Validation {
  const isLetterReg = /^[A-Za-z]+$/;
  export const isNumberReg = /^[0-9]+$/;
  export const checkLetter = (text: any) => {
    return isLetterReg.test(text);
  };
}
```

然后在 index.ts 文件中引入并使用：

```js
import { Validation } from "./Validation.ts";
let isLetter = Validation.checkLetter("sdfsd");
const reg = Validation.isNumberReg;
console.log(isLetter); // true
console.log(reg); // /^[0-9]+$/
```

::: tip
这里要提醒大家的是，命名空间本来就是防止变量污染，但是模块也能起到这个作用，而且使用模块还可以自己定义引入之后的名字。所以，并不建议导出一个命名空间，这种情况你应该是用模块。
:::

### 拆分为多个文件

随着内容不断增多，我们可以将同一个命名空间拆成多个文件分开维护，尽管分成了多个文件，但它们仍然是同一个命名空间。下面我们将 Validation.ts 拆开成 LetterValidation.ts 和 NumberValidation.ts：

```js
// LetterValidation.ts
namespace Validation {
  export const isLetterReg = /^[A-Za-z]+$/;
  export const checkLetter = (text: any) => {
    return isLetterReg.test(text);
  };
}
// NumberValidation.ts
namespace Validation {
  export const isNumberReg = /^[0-9]+$/;
  export const checkNumber = (text: any) => {
    return isNumberReg.test(text);
  };
}
// index.ts
/// <reference path="./LetterValidation.js"/>
/// <reference path="./NumberValidation.js"/>
let isLetter = Validation.checkLetter("sdfsd");
const reg = Validation.isNumberReg;
console.log(isLetter); // true
```

我们使用命令行来编译一下：

```js
tsc --outFile src/index.js src/index.ts
```

最后输出的 index.js 文件是这样的：

```js
var Validation;
(function(Validation) {
  Validation.isLetterReg = /^[A-Za-z]+$/;
  Validation.checkLetter = function(text) {
    return Validation.isLetterReg.test(text);
  };
})(Validation || (Validation = {}));
var Validation;
(function(Validation) {
  Validation.isNumberReg = /^[0-9]+$/;
  Validation.checkNumber = function(text) {
    return Validation.isNumberReg.test(text);
  };
})(Validation || (Validation = {}));
/// <reference path="./LetterValidation.ts"/>
/// <reference path="./NumberValidation.ts"/>
var isLetter = Validation.checkLetter("sdfsd");
var reg = Validation.isNumberReg;
console.log(isLetter); // true
```

可以看到，我们使用 reference 引入的两个命名空间都被编译在了一个文件，而且是按照引入的顺序编译的。我们先引入的是 LetterValidation，所以编译后的 js 文件中，LetterValidation 的内容在前面。而且看代码可以看出，两个验证器最后都合并到了一起，所以 Validation 对象有两个正则表达式，两个方法。

### 别名

我们使用 import 给常用的对象起一个别名，但是要注意，这个别名和类型别名不是一回事，而且这儿的 import 也只是为了创建别名不是引入模块。来看怎么使用，这是官方文档的原始例子：

```js
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Squaire {}
  }
}
import polygons = Shapes.Polygons; // 使用 import 关键字给 Shapes.Polygons 取一个别名polygons
let sq = new polygons.Square();
```

通过这个例子我们可以看到，使用 import 关键字来定义命名空间中某个输出元素的别名，可以减少我们深层次获取属性的成本。

## 声明合并

声明合并是指 TypeScript 编译器会将名字相同的多个声明合并为一个声明，合并后的声明同时拥有多个声明的特性。我们知道在 JavaScrip 中，使用var关键字定义变量时，定义相同名字的变量，后面的会覆盖前面的值。使用let 定义变量和使用 const 定义常量时，不允许名字重复。在 TypeScript 中，接口、命名空间是可以多次声明的，最后 TypeScript 会将多个同名声明合并为一个。我们下来看个简单的例子：

```js
interface Info {
    name: string
}
interface Info {
    age: number
}
let info: Info
info = { // error 类型“{ name: string; }”中缺少属性“age”
    name: 'zhoujw'
}
info = { // right
    name: 'zhoujw',
    age: 18
}
```

### 补充知识

TypeScript的所有声明概括起来，会创建这三种实体之一：**命名空间、类型**和**值**:

* 命名空间的创建实际是创建一个对象，对象的属性是在命名空间里export导出的内容；
* 类型的声明是创建一个类型并赋给一个名字；
* 值的声明就是创建一个在JavaScript中可以使用的值。

下面这个表格会清晰的告诉你，每一种声明类型会创建这三种实体中的哪种，先来说明一下，第一列是指声明的内容，每一行包含4列，表明这一行中，第一列的声明类型创建了后面三列哪种实体，打钩即表示创建了该实体：

|声明类型 |创建了命名空间|创建了类型|创建了值|
|:----:|:-:|:-:|:-:|
| namespace | √ |   | √ |
| class     |   | √ | √ |
| enum      |   | √ | √ |
|interface  |   | √ |   |
|type类型别名|   | √ |   |
| Function  |   |   | √ |
| Variable  |   |   | √ |

可以看到，只要命名空间创建了命名空间这种实体。Class、Enum两个，Class即是实际的值也作为类使用，Enum编译为JavaScript后也是实际值，而且我们讲过，一定条件下，它的成员可以作为类型使用；Interface和类型别名是纯粹的类型；而Funciton和Variable只是创建了JavaScript中可用的值，不能作为类型使用，注意这里Variable是变量，不是常量，常量是可以作为类型使用的。

### 合并接口

多个同名接口，定义的非函数的成员命名应该是不重复的，如果重复了，类型应该是相同的，否则将会报错。

```js
interface Info {
    name: string
}
interface Info {
    age: number
}
interface Info {
    age: boolean // error 后续属性声明必须属于同一类型。属性“age”的类型必须为“number”，但此处却为类型“boolean”
}
```

对于函数成员，每个同名函数成员都会被当成这个函数的重载，且合并时后面的接口具有更高的优先级。来看下多个同名函数成员的例子：

```js
interface Res {
    getRes(input: string): number
}
interface Res {
    getRes(input: number): string
}
const res: Res = {
    getRes: (input: any): any => {
        if (typeof input === 'string') return input.length
        else return String(input)
    }
}
res.getRes('123').length // error 类型“number”上不存在属性“length”
```

### 合并命名空间

同名命名空间最后会将多个命名空间导出的内容进行合并，如下面两个命名空间：

```js
namespace Validation {
    export const checkNumber = () => {}
}
namespace Validation {
    export const checkString = () => {}
}

// 上面定义两个同名命名空间，效果相当于：
namespace Validation {
    export const checkNumber = () => {}
    export const checkString = () => {}
}
```

在命名空间里，有时我们并不是把所有内容都对外部可见，对于没有导出的内容，在其它同名命名空间内是无法访问的：

```js
namespace Validation {
    const numberReg = /^[0-9]+$/
    export const stringReg = /^[A-Za-z]+$/
    export const checkString = () => {}
}
namespace Validation {
    export const checkNumber = (value: any) => {
        return numberReg.test(value) // error 找不到名称“numberReg”
    }
}
```

上面定义的两个命名空间，numberReg没有使用export导出，所以在第二个同名命名空间内是无法使用的，如果给 const numberReg 前面加上 export，就可以在第二个命名空间使用了。

### 不同类型合并

命名空间分别和类、函数、枚举都可以合并，下面我们来一一说明：

**(1) 命名空间和类:**

这里要求同名的类和命名空间在定义的时候，类的定义必须在命名空间前面，最后合并之后的效果，一个包含一些以命名空间导出内容为静态属性的类，来看例子：

```js
class Validation {
    checkType() { }
}
namespace Validation {
    export const numberReg = /^[0-9]+$/
    export const stringReg = /^[A-Za-z]+$/
    export const checkString = () => { }
}
namespace Validation {
    export const checkNumber = (value: any) => {
        return numberReg.test(value)
    }
}
console.log(Validation.prototype) // { checkType: fun () {} }
console.log(Validation.prototype.constructor)
/**
{
    checkNumber: ...
    checkString: ...
    numberReg: ...
    stringReg: ...
}
*/
```

**(2) 命名空间和函数:**

在JavaScript中，函数也是对象，所以可以给一个函数设置属性，在TypeScript中，就可以通过声明合并实现。但同样要求，函数的定义要在同名命名空间前面，我们再拿之前讲过的计数器的实现来看下，如何利用声明合并实现计数器的定义：

```js
function countUp () {
    countUp.count++
}
namespace countUp {
    export let count = 0
}
countUp()
countUp()
console.log(countUp.count) // 2
```

**(3) 命名空间和枚举:**

可以通过命名空间和枚举的合并，为枚举拓展内容，枚举和同名命名空间的先后顺序是没有要求的，来看例子：

```js
enum Colors {
    red,
    green,
    blue
}
namespace Colors {
    export const yellow = 3
}
console.log(Colors)
/*
{
    0: "red",
    1: "green",
    2: "blue",
    red: 0,
    green: 1,
    blue: 2,
    yellow: 3
}
*/
```

通过打印结果你可以发现，虽然我们使用命名空间增加了枚举的成员，但是最后输出的值只有key到index的映射，没有index到key的映射。

## 混入，兼顾值和类型的合并操作

混入即把两个对象或者类的内容，混合起来，从而实现一些功能的复用。如果你使用过 Vue，你应该知道 Vue 的 mixins 这个 api，它可以允许你将一些抽离到对象的属性、方法混入到一些组件。接下来我们先来看看个在 JavaScript 中实现的简单混入：

```js
class A {
  constructor() {}
  funcA() {
    console.log("here");
  }
}
class B {
  constructor() {}
  funcB() {}
}
const mixin = (target, from) => { // 这里定义一个函数来将一个类混入到目标类
  Object.getOwnPropertyNames(from).forEach(key => { // 通过Object.getOwnPropertyNames可以获取一个对象自身定义的而非继承来的属性名组成的数组
    target[key] = from[key]; // 将源类原型对象上的属性拿来添加到目标类的原型对象上
  });
};
mixin(B.prototype, A.prototype); // 传入两个类的原型对象
const b = new B();
b.funcA(); // here
```

我们通过 `Object.getOwnPropertyNames` 方法获取一个对象自身的属性，这里自身指除去继承的属性，获取到属性后将属性赋值给目标对象。

这是 JavaScript 中的简单混入，在 TypeScript 中我们知道，除了值还有类型的概念，所以简单地将属性赋值到目标元素是不行的，还要处理类型定义，我们来看下 TypeScript 中混入的例子：

```js
class ClassAa {
  isA: boolean;
  funcA() {}
}
class ClassBb {
  isB: boolean;
  funcB() {}
}
// 定义一个类类型接口AB，我们在讲类的时候补充过类和接口之间的继承，也讲过类类型接口
// 这里是让类AB继承ClassAa和ClassBb的类型，所以使用implements关键字，而不是用extends
class AB implements ClassAa, ClassBb {        
  constructor() {}
  isA: boolean = false; // 定义两个实例属性
  isB: boolean = false;
  funcA: () => void; // 定义两个方法，并指定类型
  funcB: () => void;
}
function mixins(base: any, from: any[]) { // 这里我们改造一下，直接传入类，而非其原型对象，base是我们最后要汇总而成的类，from是个数组，是我们要混入的源类组成的数组
  from.forEach(fromItem => {
    Object.getOwnPropertyNames(fromItem.prototype).forEach(key => {
      base.prototype[key] = fromItem.prototype[key];
    });
  });
}
mixins(AB, [ClassAa, ClassBb]);
const ab = new AB();
console.log(ab);
/*
{
    isA: false,
    isB: false,
    __proto__: {
        funcA: f ()
        funcB: f ()
        constructor: f
    }
}
*/
```

来看下这个例子。这个例子中我们定义了两个类 A 和 B，它们分别有自己的方法和实力属性。如果我们想使用它们的所有属性和方法来创建实例，就需要将它们做一个混合。因为包含类型定义，所以我们首先要定义一个接口，来包含着两个类中元素类型的定义。所以我们定义一个类类型接口，然后让这个类类型接口 AB 通过 implements 继承 A 和 B 这两个类，这样类 AB 就会同时拥有类 A 和 B 的类型定义，还有自身定义的一些类型和值。所以此时类 AB 相当于：

```js
class AB {
  isA: boolean = false;
  isB: boolean = false;
  funcA: () => void;
  funcB: () => void;
}
```

然后我们通过 mixins 函数将类 A 和类 B 的原型对象的属性方法赋值给类 AB，因为类 AB 有 funcA 和 funcB 的类型定义，所以可以把 funcA 和 funcB 函数实体赋值给类 AB。

## Promise及其语法糖async和await

ES7 中增加了 async 和 await 的规范，它们其实是 Promise 的语法糖。TypeScript 在 1.6 支持了 async 和 await，下面我们通过 setTimeout 来实现异步过程，看下在 TypeScript 中如何使用 async 和 await：

```js
interface Res { // 我们定义一个接口，用来定义接口返回结果的结构
  data: {
    [key: string]: any;
  };
}
namespace axios { // 现在我们来定义一个命名空间，用来模拟axios实现接口调用
  export function post(url: string, config: object): Promise<Res> { // 返回值类型是一个Promise，resolve传的参数的类型是Res
    return new Promise((resolve, reject) => { // 然后这里返回一个Promise
      setTimeout(() => { // 通过setTimeout实现异步效果
        let res: Res = { data: {} };
        if (url === "/login") res.data.user_id = 111; // 我们这里通过简单判断，来模拟调用不同接口返回不同数据的效果
        else res.data.role = "admin";
        console.log(2);
        resolve(res); // 在这里传入res结果
      }, 1000);
    });
  }
}
interface Info {
  user_name: string;
  password: string;
}
async function loginReq({ user_name, password }: Info) { // 这里使用async关键字修饰这个函数，那么他内部就可以包含异步逻辑了
  try {
    console.log(1);
    const res = await axios.post("/login", { // 这里调用/login接口
      data: {
        user_name,
        password
      }
    });
    console.log(3);
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
async function getRoleReq(user_id: number) {
  try {
    const res = await axios.post("/user_roles", {
      data: {
        user_id
      }
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
loginReq({ user_name: "lison", password: "123" }).then(res => {
  const {
    data: { user_id }
  } = res;
  getRoleReq(user_id).then(res => {
    const {
      data: { role }
    } = res;
    console.log(role);
  });
});
```

TypeScript 对于 async/await 的支持是在 1.6 版本开始的，但是这要求你代码的构建目标是"ES6"；1.7 版本对原生支持 ES6 Generator 的引擎中支持了异步函数；2.1 版本可以将异步函数编译为 ES3 和 ES5。

## tsconfig 配置

tsconfig.json 是放在项目根目录，用来配置一些编译选项等。当我们使用 tsc 命令编译项目，且没有指定输入文件时，编译器就会去查找 tsconfig.json 文件。如果在当前目录没找到，就会逐级向父文件夹查找。我们也可以通过在 tsc 命令中加上–project 参数，来指定一个包含 tsconfig.json 文件的目录。如果命令行上指定了输入文件时，tsconfig.json 的配置会被忽略。

```shell
# 直接在项目根目录下执行tsc命令，会自动根据tsconfig.json配置项编译
tsc
# 指定要编译的项目，即tsconfig.json所在文件目录
tsc --project ./dir/project
# 指定要编译的文件，忽略tsconfig.json文件配置
tsc ./src/main.ts
```

接下来我们看一下 tsconfig.json 里都有哪些可配置项。tsconfig.json 文件里有几个主要的配置项：

```json
{
  "compileOnSave": true,
  "files": [],
  "include": [],
  "exclude": [],
  "extends": "",
  "compilerOptions": {}
}
```

我们来逐个学习它们的作用，以及可配置的值：

[1] `compileOnSave`

compileOnSave 的值是 true 或 false。如果设为 true，在我们编辑了项目中文件保存的时候，编辑器会根据 tsconfig.json 的配置重新生成文件，不过这个要编辑器支持。

[2] `files`

files 可以配置一个数组列表，里面包含指定文件的相对或绝对路径。编译器在编译的时候只会编译包含在 files 中列出的文件。如果不指定，则取决于有没有设置 include 选项；如果没有 include 选项，则默认会编译根目录以及所有子目录中的文件。这里列出的路径必须是指定文件，而不是某个文件夹，而且不能使用 `*`、`？`、`**/`等通配符。

[3] `include`

include 也可以指定要编译的路径列表，但和 files 的区别在于，这里的路径可以是文件夹，也可以是文件，可以使用相对和绝对路径，而且可以使用通配符。比如 `"./src"` 即表示要编译 src 文件夹下的所有文件以及子文件夹的文件。

[4] `exclude`

exclude 表示要排除的、不编译的文件，它也可以指定一个列表，规则和 include 一样，可以是文件可以是文件夹，可以是相对路径或绝对路径，可以使用通配符。

[5] `extends`

extends 可以通过指定一个其它的 tsconfig.json 文件路径，来继承这个配置文件里的配置，继承来的文件配置会覆盖当前文件定义的配置。TS 在 3.2 版本开始，支持继承一个来自 Node.js 包的 tsconfig.json 配置文件。

[6] `compilerOptions`

最后要讲的这个 compilerOptions 是重点了，它用来设置编译选项。因为它包含很多的可配置项，下面我们来看下 compilerOptions 里的所有可配项：

**我们先来看第一类，一些比较基本的配置：**

* target

target 用于指定编译之后的版本目标，可选值有：`ES3(默认值)`、`ES5`、`ES2015`、`ES2016`、`ES2016`、`ESNEXT`。如果不配置 target 项，默认是讲代码转译为 ES3 的版本，如果设为 ESNEXT，则为最新 ES 规范版本。

* module

module 用来指定要使用的模块标准，可选值有：`commonjs`、`amd`、`system`、`umd`、`es2015(或写 es6)`。如果不设置 module 选项，则如果 target 设为 ES6，那么 module 默认值为 ES6，否则是 commonjs。

* lib

lib 用于指定要包含在编译中的库文件。如果你要使用一些 ES6 的新语法，你需要引入 ES6 这个库，或者也可以写 ES2015。如果没有指定 lib 配置，默认会加载一些库，而加载什么库是受 target 影响的。如果 target 为 ES5，默认包含的库有 `DOM`、`ES5`、`ScriptHost`；如果 target 是 ES6，默认引入的库有 `DOM`、`ES6`、`DOM.Iterable` 和 `ScriptHost`。

* allowJs

allowJs 设置的值为 true 或 false，用来指定是否允许编译 JS 文件，默认是 false，即不编译 JS 文件。

* checkJs

checkJs 的值为 true 或 false，用来指定是否检查和报告 JS 文件中的错误，默认是 false。

* declaration

declaration 的值为 true 或 false，用来指定是否在编译的时候生成响应的".d.ts"声明文件。如果设为 true，编译每个 ts 文件之后会生成一个 js 文件和一个声明文件。但是 declaration 和 allowJs 不能同时设为 true。

* sourceMap

sourceMap 的值为 true 或 false，用来指定编译时是否生成.map 文件。

* outFile

outFile 用于指定将输出文件合并为一个文件，它的值为一个文件路径名，比如设置为 `"./dist/main.js"`，则输出的文件为一个 main.js 文件。但是要注意，只有设置 module 的值为 amd 和 system 模块时才支持这个配置。

* outDir

outDir 用来指定输出文件夹，值为一个文件夹路径字符串，输出的文件都将放置在这个文件夹。

* rootDir

用来指定编译文件的根目录，编译器会在根目录查找入口文件，如果编译器发现以 rootDir 的值作为根目录查找入口文件并不会把所有文件加载进去的话会报错，但是不会停止编译。

* removeComments

removeComments 值为 true 或 false，用于指定是否将编译后的文件中的注释删掉，设为 true 的话即删掉注释，默认为 false。

* noEmit

不生成编译文件，这个一般很少用了。

* importHelpers

importHelpers 的值为 true 或 false，指定是否引入 tslib 里的辅助工具函数，默认 false。

* isolatedModules

isolatedModules 的值为 true 或 false，指定是否将每个文件作为单独的模块，默认为 true，它不可以和 declaration 同时设定。

**第二类是和严格类型检查相关的，开启了这些检查如果有错会报错：**

* noImplicitAny

noImplicitAny 的值为 true 或 false，如果我们没有为一些值设置明确的类型，编译器会默认这个值为 any 类型，如果将 noImplicitAny 设为 true，则如果没有设置明确的类型会报错，默认值为 false。

* alwaysStrict

alwaysStrict 的值为 true 或 false，指定始终以严格模式检查每个模块，并且在编译之后的 JS 文件中加入"use strict"字符串，用来告诉浏览器该 JS 为严格模式。

* strictNullChecks

strictNullChecks 的值为 true 或 false，当设为 true 时，null 和 undefined 值不能赋值给非这两种类型的值，别的类型的值也不能赋给它们。 除了 any 类型，还有个例外就是 undefined 可以赋值给 void 类型。

* strictFunctionTypes

strictFunctionTypes 的值为 true 或 false，用来指定是否使用函数参数双向协变检查。还记得我们讲类型兼容性的时候讲过函数参数双向协变的这个例子：

```js
let funcA = function(arg: number | string): void {};
let funcB = function(arg: number): void {};
funcA = funcB;
```

如果开启了 strictFunctionTypes，这个赋值就会报错，默认为 false

* strictPropertyInitialization

strictPropertyInitialization 的值为 true 或 false，设为 true 后会检查类的非 undefined 属性是否已经在构造函数里初始化，如果要开启这项，需要同时开启 strictNullChecks，默认为 false。

* strictBindCallApply

strictBindCallApply 的值为 true 或 false，设为 true 后会对 bind、call 和 apply 绑定方法参数的检测是严格检测的，如下面的例子：

```js
function foo(a: number, b: string): string {
  return a + b;
}
let a = foo.apply(this, [1]); // error Property '1' is missing in type '[number]' but required in type '[number, string]'
let b = foo.apply(this, [1, 2]); // error 不能将类型“number”分配给类型“string”
let ccd = foo.apply(this, [1, "a"]); // right
let ccsd = foo.apply(this, [1, "a", 2]); // right
```

* strict

strict 的值为 true 或 false，用于指定是否启动所有类型检查，如果设为 true 则会同时开启前面这几个严格类型检查，默认为 false。

**第三类为额外的一些检查，开启了这些检查如果有错会提示不会报错：**

* noUnusedLocals

noUnusedLocals 的值为 true 或 false，用于检查是否有定义了但是没有使用的变量，对于这一点的检测，使用 ESLint 可以在你书写代码的时候做提示，你可以配合使用。它的默认值为 false。

* noUnusedParameters

noUnusedParameters 的值为 true 或 false，用于检查是否有在函数体中没有使用的参数，这个也可以配合 ESLint 来做检查，它默认是 false。

* noImplicitReturns

noImplicitReturns 的值为 true 或 false，用于检查函数是否有返回值，设为 true 后，如果函数没有返回值则会提示，默认为 false。

* noFallthroughCasesInSwitch

noFallthroughCasesInSwitch 的值为 true 或 false，用于检查 switch 中是否有 case 没有使用 break 跳出 switch，默认为 false。

**接下来是模块解析相关的：**

* moduleResolution

moduleResolution 用于选择模块解析策略，有"node"和"classic"两种类型，我们在讲模块解析的时候已经讲过了。

* baseUrl

baseUrl 用于设置解析非相对模块名称的基本目录，这个我们在讲《模块和命名空间》的“模块解析配置项”一节时已经讲过了，相对模块不会受 baseUrl 的影响。

* paths

paths 用于设置模块名到基于 baseUrl 的路径映射，我们前面也讲过，比如这样配置：

```json
{
  "compilerOptions": {
    "baseUrl": ".", // 如果使用paths，必须设置baseUrl
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // 此处映射是相对于"baseUrl"
    }
  }
}
```

还有当我们要为没有声明文件的第三方模块写声明文件时，我们可以先如下设置：

```json
{
  "compilerOptions": {
    "baseUrl": ".", // 如果使用paths，必须设置baseUrl
    "paths": {
      "*": ["./node_modules/@types/*", "./typings/*"]
    }
  }
}
```

然后在 tsconfig.json 文件所在的目录里建一个 typings 文件夹，然后为要写声明文件的模块建一个同名文件夹，比如我们要为 make-dir 这个模块写声明文件，那么就在 typings 文件夹下新建一个文件夹，命名为 make-dir，然后在 make-dir 文件夹新建一个 index.d.ts 声明文件来为这个模块补充声明。

* rootDirs

rootDirs 可以指定一个路径列表，在构建时编译器会将这个路径列表中的路径内容都放到一个文件夹中，我们在前面也学习了。

* typeRoots

typeRoots 用来指定声明文件或文件夹的路径列表，如果指定了此项，则只有在这里列出的声明文件才会被加载。

* types

types 用来指定需要包含的模块，只有在这里列出的模块声明文件才会被加载进来。

* allowSyntheticDefaultImports

allowSyntheticDefaultImports 的值为 true 或 false，用来指定允许从没有默认导出的模块中默认导入。

**接下来的是 source map 的一些配置项：**

* sourceRoot

sourceRoot 用于指定调试器应该找到 TypeScript 文件而不是源文件位置，这个值会被写进.map 文件里。

* inlineSourceMap

inlineSourceMap 值为 true 或 false，指定是否将 map 文件的内容和 js 文件编译在同一个 js 文件中。如果设为 true，则 map 的内容会以 `//# sourceMappingURL=` 然后接 base64 字符串的形式插入在 js 文件底部。

* inlineSources

inlineSources 的值是 true 或 false，用于指定是否进一步将.ts 文件的内容也包含到输出文件中。

**最后还有两个其他的配置项：**

* experimentalDecorators

experimentalDecorators 的值是 true 或 false，用于指定是否启用实验性的装饰器特性，我们在讲装饰器的时候已经学习过了。

* emitDecoratorMetadata

emitDecoratorMetadata 的值为 true 或 false，用于指定是否为装饰器提供元数据支持。关于元数据，也是 ES6 的新标准，可以通过 Reflect 提供的静态方法获取元数据，如果需要使用 Reflect 的一些方法，需要引入 ES2015.Reflect 这个库。

**小结：**

本小节我们逐条看了tsconfig.json文件里可以配置的项目，随着后面TypeScript的升级，可能配置项会比这里多，你可以参考官方文档的升级日志来查看更新。本小节我们学了六个顶级配置项：compileOnSave、files、include、exclude、extends和compilerOptions，其中我们最常用的是compilerOptions，用来配置编译选项。有一些参数是只能在tsconfig.json文件里配置的，而有一些则既可以在tsconfig.json文件配置，也可以在tsc命令行中指定，具体一个参数可以在哪里指定，可以参考[编译选项列表](https://www.tslang.cn/docs/handbook/compiler-options.html)，这里有标注。

## 声明文件

建设中。。。

## 书写第三方声明文件

建设中。。。
