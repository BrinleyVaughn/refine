import React, { ReactNode } from "react";
import { Route } from "react-router-dom";
import { Table } from "antd";

import { render, TestWrapper, MockJSONServer, wait } from "@test";
import { List } from "./index";
import { IAccessControlContext } from "../../../interfaces";

const renderList = (
    list: ReactNode,
    accessControlProvider?: IAccessControlContext,
) => {
    return render(<Route path="/:resource">{list}</Route>, {
        wrapper: TestWrapper({
            dataProvider: MockJSONServer,
            resources: [{ name: "posts", route: "posts" }],
            routerInitialEntries: ["/posts"],
            accessControlProvider,
        }),
    });
};
describe("<List/>", () => {
    describe("JSON Rest Server", () => {
        it("mounts with table", async () => {
            const { getByText } = renderList(
                <List key="posts">
                    <Table rowKey="id" />
                </List>,
            );

            getByText("No Data");
        });
        it("renders given data", async () => {
            const { container } = renderList(
                <List key="posts">
                    <Table rowKey="id">
                        <Table.Column
                            key="title"
                            title="Title"
                            dataIndex="title"
                        />
                    </Table>
                </List>,
            );

            expect(container).toMatchSnapshot();
        });

        it("should render optional title with title prop", async () => {
            const { getByText } = renderList(<List title="New Title"></List>);
            getByText("New Title");
        });

        describe("render create button", () => {
            it("should create edit button", () => {
                const { getByText, queryByTestId } = render(
                    <Route path="/:resource">
                        <List />
                    </Route>,
                    {
                        wrapper: TestWrapper({
                            dataProvider: MockJSONServer,
                            resources: [
                                {
                                    name: "posts",
                                    route: "posts",
                                    canCreate: true,
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                expect(queryByTestId("list-create-button")).not.toBeNull();

                getByText("Posts");
            });

            it("should not render create button on resource canCreate false", () => {
                const { getByText, queryByTestId } = render(
                    <Route path="/:resource">
                        <List />
                    </Route>,
                    {
                        wrapper: TestWrapper({
                            dataProvider: MockJSONServer,
                            resources: [
                                {
                                    name: "posts",
                                    route: "posts",
                                    canCreate: false,
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                expect(queryByTestId("list-create-button")).toBeNull();

                getByText("Posts");
            });

            it("should render create button on resource canCreate false & createButtonProps props not null on component", () => {
                const { getByText, queryByTestId } = render(
                    <Route path="/:resource">
                        <List createButtonProps={{ size: "large" }} />
                    </Route>,
                    {
                        wrapper: TestWrapper({
                            dataProvider: MockJSONServer,
                            resources: [
                                {
                                    name: "posts",
                                    route: "posts",
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                expect(queryByTestId("list-create-button")).not.toBeNull();

                getByText("Posts");
            });

            it("should render create button on resource canCreate true & createButtonProps props not null on component", () => {
                const { getByText, queryByTestId } = render(
                    <Route path="/:resource">
                        <List createButtonProps={{ size: "large" }} />
                    </Route>,
                    {
                        wrapper: TestWrapper({
                            dataProvider: MockJSONServer,
                            resources: [
                                {
                                    name: "posts",
                                    route: "posts",
                                    canCreate: true,
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                expect(queryByTestId("list-create-button")).not.toBeNull();

                getByText("Posts");
            });

            it("should not render create button on resource canCreate true & canCreate props false on component", () => {
                const { queryByTestId } = render(
                    <Route path="/:resource">
                        <List canCreate={false} />
                    </Route>,
                    {
                        wrapper: TestWrapper({
                            dataProvider: MockJSONServer,
                            resources: [
                                {
                                    name: "posts",
                                    route: "posts",
                                    canCreate: true,
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                expect(queryByTestId("list-create-button")).toBeNull();
            });

            it("should render create button on resource canCreate false & canCreate props true on component", () => {
                const { queryByTestId } = render(
                    <Route path="/:resource">
                        <List canCreate={true} />
                    </Route>,
                    {
                        wrapper: TestWrapper({
                            dataProvider: MockJSONServer,
                            resources: [
                                {
                                    name: "posts",
                                    route: "posts",
                                    canCreate: false,
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                expect(queryByTestId("list-create-button")).not.toBeNull();
            });

            it("should render disabled create button if user doesn't have permission", async () => {
                const { queryByTestId } = renderList(
                    <List canCreate={true} />,
                    {
                        can: ({ action }) => {
                            switch (action) {
                                case "create":
                                    return Promise.resolve({ can: false });
                                default:
                                    return Promise.resolve({ can: false });
                            }
                        },
                    },
                );

                await wait(() =>
                    expect(queryByTestId("list-create-button")).toBeDisabled(),
                );
            });
        });
    });
});
