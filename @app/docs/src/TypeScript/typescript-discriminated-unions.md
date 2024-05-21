# Typescript 的 Discriminated Unions(可辨識聯合)

## 前言

在 TypeScript 中，我們常會遇到 [Union Type(聯合型別)](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types)，這是一種可以接受多種型別的變數。這時候我們需要 [Narrowing(縮小範圍)](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) 來確保變數的型別，而 **Discriminated Unions** 指的就是一種可以透過特定屬性來縮小範圍的 Union Type。

## 開始

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

> **[Playground](https://www.typescriptlang.org/play/?#code/C4TwDgpgBAIg9gcygXigbwFBSqSAuKAcgBNFCBuLKAYzgBs4AnAgZ2EYEsA7BS7AQwQQCXAK4BbAEYRGfKADd+nCKFbtuvKpKUBrNZx6UAvhgy5oAYX7AU6KuYKFq1ilVoNmUNgc0ChIiWlZKkVlVS91QypxCDgAd30NY1NzKAAhDkZiW0xsByJJTOJXbHcmRKi-YSgxKRk5UI4VEArfKDiNFjB+LgC64JMzcGgAQS4OcX46W3gkAB8oKxsFjKzKDAAzUS5qYA44LigwA2AxiamAZR0OOjoACh7zugIzyboASjtsFg7gagALKAPcZvAB05k+uWwNH4LGgJDIeCo0JoBxY9AgoIYCGBT1B2kYOnechRkkYEH4OhJMLhRGcwEISJRpTRGKxiFxYJi8WJyOhZIpVL5zlphEKWUZfJZXHRdEx2M5U1BHR4XR6vOZUAFlLkJiMQA)**

其中 `type Animal = Dog | Cat | Bird;` 是一個 **Union Type**，而且可以透過 `type` 來判斷該物件的型別，就可以稱作是 **Discriminated Unions**，type 屬性就稱作是這個物件的 **Discriminator(區分器)**。

### 使用時機

當我們在開發時，如果有一個物件有相似的屬性，但是有些屬性是獨有的，這時候就可以使用 **Discriminated Unions** 來區分物件的型別，這樣在開發時就可以避免錯誤的發生。

```typescript
type Animal = {
  type: 'dog' | 'cat' | 'bird';
  color: string;
  age: number;
  variety: string;
  bark?: string;
  meow?: string;
  wingspan?: number;
}

declare const dog: Animal

dog.meow // 雖然沒有 ts 錯誤，但狗不應該有喵叫
dog.wingspan // 雖然沒有 ts 錯誤，但狗不應該有翅膀

```

### Discriminator 的限制

在 **Discriminated Unions** 中，Discriminator 的值通常都要是 **Literal Type(明文型別)**，而避免使用 **General Type(通用型別)**，否則在嘗試縮小範圍時，會與預期不符。

**General Type**:x:

```typescript
type SucessState = {
  state: string
}

type ErrorState = {
  state: number,
  message: string
}

type State = SucessState | ErrorState
const getState = (response: State) => {
  if (typeof response.state === 'number') {
    console.error(response.message) // Property 'message' does not exist on type 'State' # [!code error]
  }
  return response.state
}
```

**Literal Type**:white_check_mark:

```typescript
type SucessState = {
  state: 'success'
}

type ErrorState = {
  state: 500,
  message: string
}

type State = SucessState | ErrorState
const getState = (response: State) => {
  if (response.state === 500) {
    console.error(response.message)
  }
  return response.state
}

```

#### Type Guards

而如果遇到 Discriminator 是 **General Type(通用型別)** 的情況，可以透過其中一種 Type Guards 的方式，叫做 [Type Predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)。

將上面的例子改寫成 Type Guards 的方式：

```typescript
type SucessState = {
  state: string
}

type ErrorState = {
  state: number,
  message: string
}

type State = SucessState | ErrorState

const isErorState = (response: State): response is ErrorState => {  // [!code ++]
  if (typeof response.state === 'number') { // [!code ++]
    return true // [!code ++]
  } // [!code ++]
  return false // [!code ++]
} // [!code ++]

const getState = (response: State) => {
  if (isErorState(response)) { // [!code ++]
  if (typeof response.state === 'number') { // [!code --]
    console.error(response.message)
  }
  return response.state
}
```

## 如果 Union Type 都是 Function 呢？

當時在開發的時遇到一個型別是 Union Function，試了很多方法也不知道該如何處理 Narrowing。~~當時卡了很久最後直接 any XD~~。但是寫這篇文章的時候剛好突發奇想拿 Discriminated Unions 去餵狗，找到了[這篇](https://stackoverflow.com/questions/56781010/how-to-map-objects-in-a-discriminated-union-to-functions-they-can-be-called-with)來解決了問題

> 因為不是重點就不多做解釋，有興趣的再看下面囉
>
> :pencil2:詳細實作可以看這邊 **[Playground](https://www.typescriptlang.org/play/?#code/MYewdgzgLgBFCmAPKAxAlvANgEwBIEMxtN4AnGAXhgAoAzDHALhgG8YA3fTAV3melJowAcxgBfAJSUAfKwBQMGKXhRupMDHpZsAOk494csXLmhIsMNwC2ZNMHTaCREuSp0G2Zm329mlqwBGZOJSFLIsCkoqahpaOHpcvEYmZtCaHk7EZACy+AAOlPKKCMjMJagZhFmkADSR-rbAftaNDjiZLsly2PDAmPjKMKmwcdgAKgCeeXwwAOTlszAAPnMNgsCz3b39g8Pp2gBqiTPex-xQgiLiy6wcZzD+QeTGpuBpox3BVB9VLrl5AG1RpNpgBdFJvWA+eCFH7OMjuQ7HCQmOQAegAVFjsTjcViYIBjyMAXjaATtNAKs2MDxVJxaJMmIxMHJAEZmIB-eUAFK6AdtNAABRgDI5QCS8YBo9UptPRaJgAAsyPBZhA4FKYNxIPhaPAALT4CAQMhQNDgGAAdxApAA1gMQErPHJaErgLr9ZrtaQoAA5AakEAGlC2+1gAA8KBgSAQRDl1AGwmYhAmoVk0ekdGYKCkEUUylU6k0ME1NAjzAACgN8DYEKQIAHpACAAyg2MwABK0XUIPgFYA3DA0eLHTqunse874Ng2nhfl9s1qdW7SB6vT69WBEe0x6R-kCPC3a69zHcDEzCgOEMPKvDSEvsEcDCj0fjyQAmZiAfwTALKKHJgAFUwAuYN6wHaF4AMP8SiuMCAC9ugClxoAnMqALKJgDuioAK1mACFugB6GcKIoQjuXCYCOnyuDQoxeLuvgwAIQiiGINynAYzSBMEkjnJcogrI8XzhJEXYwG+UBTDCwjcAM2AwIACmmAHR+qGRGgtA0GgEBjMG54SCmkRpk2GjlDhK4KZExiKFg2pFIoUQZhoax2Bpp5aYoxgvPScA8TAfECehewyXJyCFOehHQgxZHXCsVHESxzwSMwowwDJtzeSRFy+RRYQGemMR2dMIBSaMCQGJQFBULKMUiJsLx7MB8IXscB6YNhJ7VOel68BIQA)**
>
> :bulb:原因可以到這邊看 [Why can't I call a union of functions with a union of parameters?](https://stackoverflow.com/questions/71339709/why-cant-i-call-a-union-of-functions-with-a-union-of-parameters)

## 結論

總結來說，如果型別上有 Union Types，優先選擇使用 **Discriminated Unions** 來管理不同類型的數據。這種方式不僅使代碼更具可讀性，還能提高類型安全性。如果無法使用的情況下，則應使用 Type Predicates 來實現 Type Guard 後才能 Narrowing。

## 參考資料

- [What are TypeScript Discriminated Unions?](https://dev.to/darkmavis1980/what-are-typescript-discriminated-unions-5hbb)
- [https://medium.com/@km87/typescript-discriminated-unions-d3b54bf14399](https://medium.com/@km87/typescript-discriminated-unions-d3b54bf14399)
- [ChatGPT](https://chatgpt.com/)
