---
id: useUpdate
title: useUpdate
siderbar_label: useUpdate
description: useUpdate data hook from refine is a modified version of react-query's useMutation for update mutations
---

`useUpdate` is a modified version of `react-query`'s [`useMutation`](https://react-query.tanstack.com/reference/useMutation#) for update mutations. It uses `update` method as mutation function from the `dataProvider` that is passed to `<Admin>`.  

## Features

* Shows notifications on success, error and cancel. 

* Automatically invalidates `list` and `getOne` queries after mutation is succesfully run.  
[Refer to React Query docs for detailed information &#8594](https://react-query.tanstack.com/guides/invalidations-from-mutations)

* Supports [mutation mode](#mutation-mode).


## Usage

Let'say we have a `categories` resource

```ts title="https://refine-fake-rest.pankod.com/categories"
{
    [
        {
            id: 1,
            title: "E-business",
        },
        {
            id: 2,
            title: "Virtual Invoice Avon",
        },
    ];
}
```

```tsx
type CategoryMutationResult = {
    id: string | number;
    title: string;
}

const { mutate } = useUpdate<CategoryMutationResult>("categories");

mutate({ id: 2, values: { title: "New Category Title" } })
```

:::tip
`mutate` can also accept lifecycle methods like `onSuccess` and `onError`.  
[Refer to react-query docs for further information.  &#8594](https://react-query.tanstack.com/guides/mutations#mutation-side-effects)
:::

<br/>

After mutation runs `categories` will be updated as below:

```ts title="https://refine-fake-rest.pankod.com/categories"
{
    [
        {
            id: 1,
            title: "E-business",
        },
        {
            id: 2,
            // highlight-next-line
            title: "New Category Title",
        },
    ];
}
```
<br/>

:::note
Queries that use `/categories` endpoint will be automatically invalidated to show the updated data. For example, data returned from [`useList`](#) and [`useOne`](#) will be automatically updated.
:::

:::tip
`useUpdate` returns `react-query`'s `useMutation` result. It includes `mutate` with  [many other properties](https://react-query.tanstack.com/reference/useMutation).
:::

:::important
Values passed to `mutate` must have the type of

```tsx
{
    id: string;
    values: TVariables = {};
}
```
:::

## Mutation mode

Determines the mode with which the mutation runs.

```tsx
const { mutate } = useUpdate("categories", "optimistic");
```
 `pessimistic` : The mutation runs immediately. Redirection and UI updates are executed after the mutation returns successfuly.

 `optimistic` : The mutation is applied locally, redirection and UI updates are executed immediately as if mutation is succesful. If mutation returns with error, UI updates accordingly.

 `undoable`: The mutation is applied locally, redirection and UI updates are executed immediately as if mutation is succesful. Waits for a customizable amount of timeout before mutation is applied. During the timeout, mutation can be cancelled from the notification with an undo button and UI will revert back accordingly.


[Refer to mutation mode docs for further information. &#8594](#)


## Custom method on mutation cancellation
You can pass a custom cancel callback to `useUpdate`. That callback is triggered when undo button is clicked when  `mutationModeProp = "undoable"`.

:::caution
Default behaviour on undo action includes notifications. If a custom callback is passed this notification will not appear.
:::

:::danger
Passed callback will receive a function that actually cancels the mutation. Don't forget to run this function to cancel the mutation on `undoable` mode.

```tsx
const customOnCancel = (cancelMutation) => {
    cancelMutation()
    // rest of custom cancel logic...
}

const { mutate } = useUpdate("categories", "undoable", 7500, customOnCancel);
```
After 7.5 seconds the mutation will be executed. The mutation can be cancelled within that 7.5 seconds. If cancelled `customOnCancel` will be executed and the request will not be sent.
:::

<br />

## API

### Parameters


| Property                                            | Description                                                                         | Type                                             | Default          |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------- |
| resource  <div className=" required">Required</div> | [`Resource`](#) for API data interactions                                           | `string`                                         |                  |
| mutationModeProp                                    | [Determines when mutations are executed](#)                                         | ` "pessimistic` \| `"optimistic` \| `"undoable"` | `"pessimistic"`* |
| undoableTimeoutProp                                 | Duration to wait before executing the mutation when `mutationModeProp = "undoable"` | `number`                                         | `5000ms`*        |
| onCancel                                            | Callback that runs when undo button is clicked on `mutationModeProp = "undoable"`   | `(cancelMutation: () => void) => void`           |                  |

>`*`: These props have default values in `AdminContext` and can also be set on **<[Admin](#)>** component. `useUpdate` will use what is passed to `<Admin>` as default and can override locally.

<br/>

### Type Parameters

| Property   | Desription                                             | Type              | Default           |
| ---------- | ------------------------------------------------------ | ----------------- | ----------------- |
| TData      | Result data of the mutation. Extends [`BaseRecord`](#) | [`BaseRecord`](#) | [`BaseRecord`](#) |
| TError     | Custom error object that extends [`HttpError`](#)      | [`HttpError`](#)  | [`HttpError`](#)  |
| TVariables | Values for mutation function                           | `{}`              | `{}`              |

### Return value

 | Description                               | Type                                                                                                                                                                   |
 | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 | Result of the `react-query`'s useMutation | [`UseMutationResult<`<br/>`{ data: TData },`<br/>`TError,`<br/>`  { id: string; values: TVariables; },`<br/>` UpdateContext>`](https://react-query.tanstack.com/reference/useMutation)* |

>`*` Refer to documentation for [`UpdateContext`](#)