import { Refine } from "@pankod/refine";
import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-react-router";

import "@pankod/refine/dist/styles.min.css";
import "./index.css";

import { PostList } from "pages/posts";
import { CustomSider } from "components";

const { Link } = routerProvider;

const API_URL = "https://api.fake-rest.refine.dev";

const App: React.FC = () => {
    return (
        <Refine
            dataProvider={dataProvider(API_URL)}
            routerProvider={routerProvider}
            Sider={CustomSider}
            Title={({ collapsed }) => (
                <Link to="/">
                    {collapsed ? (
                        <img
                            src="/refine-collapsed.svg"
                            alt="Refine"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "12px 24px",
                            }}
                        />
                    ) : (
                        <img
                            src="/refine.svg"
                            alt="Refine"
                            style={{
                                width: "200px",
                                padding: "12px 24px",
                            }}
                        />
                    )}
                </Link>
            )}
            resources={[
                {
                    name: "posts",
                    list: PostList,
                },
            ]}
        />
    );
};

export default App;
