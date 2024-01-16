import React from "react";
import {render} from "@testing-library/react";
import RefundPolicy from '../components/common/refund_policy_table/RefundPolicy';

test('refundPolicy', () => {
    render(<RefundPolicy/>);
  });