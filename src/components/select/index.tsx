import React from "react";
import { Select as AntdSelect } from "antd";
import { SelectProps } from "antd/lib/select";

export const Select: React.FC<SelectProps<any>> = ({ ...rest }) => {
    return <AntdSelect {...rest} />;
};