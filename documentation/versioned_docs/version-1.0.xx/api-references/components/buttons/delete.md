---
id: delete-button
title: Delete
---

import deleteButton from '@site/static/img/guides-and-concepts/components/buttons/delete/delete.png';
import confirmation from '@site/static/img/guides-and-concepts/components/buttons/delete/confirmation.gif';

`<DeleteButton>` uses Ant Design's [`<Button>`](https://ant.design/components/button/) and [`<Popconfirm>`](https://ant.design/components/popconfirm/) components.
When you try to delete something, a pop-up shows up and asks for confirmation. When confirmed it executes the [`useDelete`](api-references/hooks/data/useDelete.md) method provided by your [`dataProvider`](api-references/providers/data-provider.md).

## Usage

```tsx  {2, 20}
import {
    DeleteButton,
    List,
    Table,
    useTable,
} from "@pankod/refine";

export const PostList: React.FC = () => {
    const { tableProps } = useTable<IPost>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column<IPost>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <DeleteButton size="small" recordItemId={record.id} />
                    )}
                />
            </Table>
        </List>
    );
};

interface IPost {
    id: string;
    title: string;
}
```

Will look like this:

<div class="img-container">
    <div class="window">
        <div class="control red"></div>
        <div class="control orange"></div>
        <div class="control green"></div>
    </div>
    <img src={deleteButton} alt="Default delete button" />
</div>
<br />

When clicked, it opens the confirmation window like this:

<div class="img-container">
    <div class="window">
        <div class="control red"></div>
        <div class="control orange"></div>
        <div class="control green"></div>
    </div>
    <img src={confirmation} alt="Confirmation window" />
</div>

## Properties

### `recordItemId`

`recordItemId` allows us to manage which record will be deleted.

```tsx 
import { DeleteButton } from "@pankod/refine";

export const MyDeleteComponent = () => {
    return <DeleteButton resourceName="posts" recordItemId="1" />;
};
```

Clicking the button will trigger the [`useDelete`](api-references/hooks/data/useDelete.md) method and then the record whose resource is "post" and whose id is "1" gets deleted.

:::note
**`<DeleteButton>`** component reads the id information from the route by default.
:::

### `resourceName`

`resourceName` allows us to manage which resource's record is going to be deleted.

```tsx 
import { DeleteButton } from "@pankod/refine";

export const MyDeleteComponent = () => {
    return <DeleteButton resourceName="categories" recordItemId="2" />;
};
```

Clicking the button will trigger the [`useDelete`](api-references/hooks/data/useDelete.md) method and then the record whose resource is "categories" and whose id is "2" gets deleted.

:::note
**`<DeleteButton>`** component reads the resource name from the route by default.
:::

### `onSuccess`

`onSuccess` can be used if you want to do anything on the result returned after the delete request.

For example, let's `console.log` after deletion:

```tsx  {18-20}
import { List, Table, DeleteButton, useTable } from "@pankod/refine";

export const PostList: React.FC = () => {
    const { tableProps } = useTable<IPost>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column<IPost>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <DeleteButton
                            size="small"
                            recordItemId={record.id}
                            onSuccess={(value) => {
                                console.log(value);
                            }}
                        />
                    )}
                />
            </Table>
        </List>
    );
};
```

### `mutationMode`

Determines which mode mutation will have while executing `<DeleteButton>`.

[Refer to the mutation mode docs for further information. &#8594](guides-and-concepts/mutation-mode.md)

```tsx  {18}
import { List, Table, DeleteButton, useTable } from "@pankod/refine";

export const PostList: React.FC = () => {
    const { tableProps } = useTable<IPost>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column<IPost>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <DeleteButton
                            size="small"
                            recordItemId={record.id}
                            mutationMode="undoable"
                        />
                    )}
                />
            </Table>
        </List>
    );
};
```

### `hideText`

It is used to show and not show the text of the button. When `true`, only the button icon is visible.

```tsx 
import { DeleteButton } from "@pankod/refine";

export const MyDeleteComponent = () => {
    return <DeleteButton hideText />;
};
```

## API Reference

### Properties

| Property     | Description                                                                                  | Type                                                                                                                        | Default                                                                              |
| ------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| props        | Ant Design button properties                                                                 | [`ButtonProps`](https://ant.design/components/button/#API) & [`DeleteButtonProps`](../../interfaces.md#delete-button-props) |                                                                                      |
| resourceName | Determines which resource to use for deletion                                                | `string`                                                                                                                    | Resource name that it reads from route                                               |
| recordItemId | Determines which id to use for deletion                                                      | `string`                                                                                                                    | Record id that it reads from route                                                   |
| onSuccess    | Called when [mutation](https://react-query.tanstack.com/reference/useMutation) is successful | `(value: DeleteOneResponse) => void`                                                                                        |                                                                                      |
| mutationMode | Determines when mutations are executed.                                                      | `"pessimistic"` \| `"optimistic"` \| `"undoable"`                                                                           |                                                                                      |
| hideText     | Allows to hide button text                                                                   | `boolean`                                                                                                                   | `false`                                                                              |
| children     | Sets the button text                                                                         | `ReactNode`                                                                                                                 | `"Delete"`                                                                           |
| icon         | Sets the icon component of the button                                                        | `ReactNode`                                                                                                                 | [`<DeleteOutlined />`](https://ant.design/components/icon/)                          |
| danger       | Sets the danger status of the button                                                         | `boolean`                                                                                                                   | `true`                                                                               |
| loading      | Sets the loading status of the button                                                        | `boolean`                                                                                                                   | When the request is not completed, loading is `true`, when it completes it's `false` |
| metaData     | Metadata query for `dataProvider`                                                            | [`MetaDataQuery`](/api-references/interfaces.md#metadataquery)                                                            | {}                                                                                   |
