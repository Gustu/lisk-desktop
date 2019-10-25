import React from 'react';
import debounce from 'lodash.debounce';
import { mount } from 'enzyme';
import RegisterDelegate from './registerDelegate';

jest.mock('lodash.debounce');

describe('RegisterDelegate', () => {
  let wrapper;

  const props = {
    account: {
      info: {
        LSK: {
          address: '123456789L',
          balance: 11000,
        },
      },
    },
    history: {
      push: jest.fn(),
      goBack: jest.fn(),
    },
    prevState: {},
    delegate: {},
    liskAPIClient: {
      delegates: {
        get: jest.fn(),
      },
    },
    delegateRegistered: jest.fn(),
    nextStep: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    props.liskAPIClient.delegates.get.mockClear();
    debounce.mockReturnValue((name, error) => !error && props.liskAPIClient.delegates.get(name));
    wrapper = mount(<RegisterDelegate {...props} />);
  });

  it('renders properly SelectName component', () => {
    expect(wrapper).toContainMatchingElement('.select-name-container');
    expect(wrapper).toContainMatchingElements(2, '.select-name-text-description');
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper).toContainMatchingElement('.feedback');
    expect(wrapper).toContainMatchingElement('.confirm-btn');
  });
});
