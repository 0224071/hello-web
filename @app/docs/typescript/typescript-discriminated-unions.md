# Typescript 的 Discriminated Unions(可辨識聯合)

## 前言

在 TypeScript 中，我們常會遇到 [Union Type(聯合型別)](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types)，這是一種可以接受多種型別的變數。這時候我們需要 [Narrowing(縮小範圍)](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) 來確保變數的型別，而 Discriminated Unions 指的就是一種可以透過特定屬性來縮小範圍的 Union Type。

## 開始

首先，我們先定義一個 Animal 的型別，並且定義了一個屬性 type 來區分不同的動物。

```typescript
type Animal ={
  type: 'dog' | 'cat' | 'bird';
}
```

接著我們又開始新增一些動物的屬性，並新增幾個變數來表示不同的動物。

```typescript
type Animal ={
  type: 'dog' | 'cat' | 'bird';
  color: string; // 顏色 # [!code highlight]
  age: number;  // 年齡 # [!code highlight]
  variety: string; // 品種 # [!code highlight]
}

const dog: Animal = {
  type: 'dog',
  color: 'brown',
  age: 3,
  variety: '柴犬'
}

const cat: Animal = {
  type: 'cat',
  color: 'white',
  age: 2,
  variety: '英短'
}

const bird: Animal = {
  type: 'bird',
  color: 'green',
  age: 1,
  variety: '鸚鵡'
}
```

看起來沒有問題。於是我們再新增幾個屬性

```typescript
type Animal = {
  type: 'dog' | 'cat' | 'bird';
  color: string; // 顏色
  age: number;  // 年齡
  variety: string; // 品種
  wingspan?: number; // 翼展 # [!code highlight]
  bark?: string; // 吠叫聲 # [!code highlight]
  meow?: string; // 喵叫聲 # [!code highlight]
}
declare const dog: Animal;
dog.wingspan // 沒有錯誤，但狗不會有翅膀
declare const cat: Animal;
cat.bark // 沒有錯誤，但貓不會吠叫
declare const bird: Animal;
bird.meow // 沒有錯誤，但鳥不會喵叫
```

> **[Playground](https://www.typescriptlang.org/play/?#code/C4TwDgpgBAggdgSwLYEMA2UC8UDeAoKKUSALigHIATAewHNyoAfCgYxWAefICMEAnSuQDcBKC2ppqfMgGdgfBHFpCoAelVRA8hmAnINEpaEMnACuSbhD4q1GwC56gQ3zRANxQKIoWfMXL1UQIMqgOi9RAHcvGTAUOAB+I1NzS2soQB--QFUdUW4XAGtoqDkFJRUfQAIVQGvlQCcA0SQIaiDs3K8CjUBW1TK8AF88SggWNBdocTg5KBpaMnhkdBFhgDoQpTCIhMAkm0BIc0B6ZMASqMAYf8AxeUB1p0BYOUBgc2XAUf9AAMCOrp6+PuoB4DF2UcRUNBE2YCn0vgylta3toBkmKOJUu3V6Yjug14Ame4zeeBhlCmlWqfw2O0ApzlHZpAA)**

這時候我們就會發現，我們在新增屬性時，即使有用 [optional(可選屬性)](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters) 的方式來定義，但沒有辦法確保該屬性是否只存在於該動物的物件中。

於是我們可以把它改成 Union Type 來解決這個問題。

```typescript
type Dog = {
  type: 'dog';
  color: string;
  age: number;
  variety: string;
  bark: string; // [!code highlight]
}

type Cat = {
  type: 'cat';
  color: string;
  age: number;
  variety: string;
  meow: string; // [!code highlight]
}

type Bird = {
  type: 'bird';
  color: string;
  age: number;
  variety: string;
  wingspan: number; // [!code highlight]
}

type Animal = Dog | Cat | Bird;

declare const dog: Dog;
dog.bark
dog.meow // Property 'meow' does not exist on type 'Dog'// [!code error]
dog.wingspan // Property 'wingspan' does not exist on type 'Dog' // [!code error]
```

> **[Playground](https://www.typescriptlang.org/play/?#code/C4TwDgpgBAIg9gcygXigbwFBSqSAuKAcgBNFCBuLKAYzgBs4AnAgZ2EYEsA7BS7AQwQQCXAK4BbAEYRGfKADd+nCKFbtuvKpKUBrNZx6UAvhgy5oAYX7AU6KuYKFq1ilVoNmUNgc0ChIiWlZKkVlVS91QypxCDgAd30NY1NzKAAhDkZiW0xsByJJTOJXbHcmRKi-YSgxKRk5UI4VEArfKDiNFjB+LgC64JMzcGgAQS4OcX46W3gkAB8oKxsFjKzKDGIIajolaFouNihSBAJZymOAOm1GHSgNxAuY+KgAeheoAAVGOEhGUCInnFCEc4BAWDU4DYIAAPDiHOBcHDDIizQj3BAXDo8Lo9V7vL4-GT-QhYhA4rjA0hgiFQ2HwxGpQiooA)**

這時我們就可以透過 `type` 來判斷該物件的型別。

```typescript
function printAnimalSkill(animal: Animal) {
  switch (animal.type) {
    case 'dog':
      console.log(animal.bark);
      break;
    case 'cat':
      console.log(animal.meow);
      break;
    case 'bird':
      console.log(animal.wingspan);
      break;
  }
}
```

> **[Playground](https://www.typescriptlang.org/play/?#code/C4TwDgpgBAIg9gcygXigbwFBSqSAuKAcgBNFCBuLKAYzgBs4AnAgZ2EYEsA7BS7AQwQQCXAK4BbAEYRGfKADd+nCKFbtuvKpKUBrNZx6UAvhgy5oAYX7AU6KuYKFq1ilVoNmUNgc0ChIiWlZKkVlVS91QypxCDgAd30NY1NzKAAhDkZiW0xsByJJTOJXbHcmRKi-YSgxKRk5UI4VEArfKDiNFjB+LgC64JMzcGgAQS4OcX46W3gkAB8oKxsFjKzKDAAzUS5qYA44LigwA2AxiamAZR0OOjoACh7zugIzyboASjtsFg7gagALKAPcZvAB05k+uWwNH4LGgJDIeCo0JoBxY9AgoIYCGBT1Bggg7zkKMkjAg-B0xJhcKIzmAhCRKNKaIxWMQuLBMXiROR0NJ5MpvOcNMIhSyDN5zK46LomOxHKmoI6PC6PR5TKg-IpchMRiAA)**

這種 Union Type 就可以稱做是 Discriminated Unions，透過特定屬性來縮小範圍，讓我們可以確保物件的型別。

> [!TIP]
> 在上面案例中，type 屬性就稱作是這個物件的 Discriminator(區分器)。
>
> 而值通常都要是 Literal Type(明文型別)，而避免使用 General Type(通用型別)，
> 否則在嘗試縮小範圍時，會與預期不符。詳細可看 [Playground](https://www.typescriptlang.org/play/?#code/C4TwDgpgBAygrgYwgZ2TYBDY0C8UDeAUFFMptgFynABOAlgHYDmUA9K1AJqCADAHKEBfQoVCQoAURo0A9jXRZcBYtQVUGcALYAjCDTYcADNwCM3AEzKNKZBiYQqZes0HDR0AEoow0hsgjzsKDx4JFQA6AAfCSlZcOFCBB8yKDtgcKCoAAoaLyT7KE9kb19-cggASiCAPiUSOgAzLLdpRpyivIA6MgUgnDwAcnVtXX7KohISRN9pABsIDt0ZGmzcko6rVFsK5SESHOA4GgYoNuK-LrKXQlTwzPxuygMAGg2bOwp+gG0DAF1AHzdAPiugHpkwAlUf0BOUgA)
>
> 這時候可以透過其中一種 Type Guards 的方式，叫做 [Type Predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)。

## 如果 Union Type 都是 Function 呢？

當時在開發的時遇到一個型別是 Union Function，試了很多方法也不知道該如何處理 Narrowing。~~當時卡了很久最後直接 any XD~~。

但是寫這篇文章的時候剛好突發奇想拿 Discriminated Unions 去餵狗，終於有找到[答案](https://stackoverflow.com/questions/56781010/how-to-map-objects-in-a-discriminated-union-to-functions-they-can-be-called-with)

```typescript
const textFieldHandler = (field: { value: string }) => {
  return field.value
}

const numericFieldHandler = (field: { value: number }) => {
  return field.value
}

const fieldHandlerMap = {
  text: textFieldHandler,
  numeric: numericFieldHandler
}

declare const fieldType: 'text' | 'numeric'
declare const fieldValue: { value: string } | { value: number }

const fieldHandler = fieldHandlerMap[fieldType]

fieldHandler(fieldValue) // error // [!code error]

// here's the unsafe-assertion workaround:
function assertNarrowFunction<F extends (arg: any) => any>(f: F) {
  return f as (arg: Parameters<F>[0]) => ReturnType<F>; // assert
}

const fieldHandler2 = assertNarrowFunction(fieldHandlerMap[fieldType])
const handledValue = fieldHandler2(fieldValue)

```

> **[Playground](https://www.typescriptlang.org/play/?#code/MYewdgzgLgBFCmAPKAxAlvANgEwBIEMxtN4AnGAXhgAoAzDHALhgG8YA3fTAV3melJowAcxgBfAJSUAfKwBQMGKXhRupMDHpZsAOk494csXLmhIsMNwC2ZNMHTaCREuSp0G2Zm329mlqwBGZOJSFLIsCkoqahpaOHpcvEYmpuDQmh5OxGQAsvgADpTyigjIzKWomYTZpAA0kf62wH7WTQ44WS7JctjwwJj4yjBm6XHYACoAnvl8MADkFXMwAD7zjYLAcz19A0MjsGMAaomz3if8UIIi4iusHOcw-kHkxqnmGY7VLkVjnbkFAG0xlMZgBdEy-L5kdzaY4GCQmAD0iJgAAsyPA5hA4OiYNxIPhaPAALT4CAQMhQNDgGAAdxApAA1oMQPjPHJaPjgFSaWSKaQoAA5QakEC0lBcnlgAA8KBgSAQRGx1EGwmYhEmoVkGukdGYKCkEUUylU6k0MDJNFVzAACoN8DYEKQILLpACAAygrUwABK0XUIPgroA3DBkRbyZTum9RlVnGQAExFPmU4WkUXiyXUsAwjpQ0h5fJAjyBr0x2CoqHYOG8H5xmoJ3PVk4SIA)**

## 參考資料

- [What are TypeScript Discriminated Unions?](https://dev.to/darkmavis1980/what-are-typescript-discriminated-unions-5hbb)
- [https://medium.com/@km87/typescript-discriminated-unions-d3b54bf14399](https://medium.com/@km87/typescript-discriminated-unions-d3b54bf14399)
