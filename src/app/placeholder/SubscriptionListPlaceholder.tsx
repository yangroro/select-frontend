import * as React from 'react';
import { range } from 'lodash-es';

export const SubscriptionListPlaceholder: React.SFC = () => (
  <ul className="SubscriptionList_Skeleton">
    {range(0, 3).map((value, index) => (
      <li className="SubscriptionItem_Skeleton" key={`subscription_item_${index}`}>
        <div className="SubscriptionTitle_Skeleton Skeleton" />
        <div className="SubscriptionDescription_Skeleton Skeleton" />
      </li>
    ))}
  </ul>
);