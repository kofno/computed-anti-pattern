import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import cardStore from './store';

interface Props {}

const emptyFragment = () => <></>;

class CardUI extends React.Component<Props> {
  componentDidMount() {
    setTimeout(() => {
      console.log('Load', toJS(cardStore.state));
      cardStore.load();
    }, 5000);
  }

  render() {
    return (
      <section>
        <>
          {cardStore.title.map((t) => <h1>{t}</h1>).getOrElse(emptyFragment)}
          {cardStore.content.map((c) => <p>{c}</p>).getOrElse(emptyFragment)}
          {cardStore.updateLink
            .map(() => (
              <button disabled={!cardStore.isUpdatable} onClick={cardStore.updating}>
                Sign Up
              </button>
            ))
            .getOrElse(() => (
              <p>You can't sign up at this time</p>
            ))}
        </>
      </section>
    );
  }
}

export default observer(CardUI);
