import { Link } from '@execonline-inc/resource';
import { assertNever } from '@kofno/piper';
import { fromNullable, just, Maybe, nothing } from 'maybeasy';
import { makeAutoObservable, toJS } from 'mobx';
import { CardResource, isUpdateLink, State } from './types';

class CardStore {
  state: State;

  constructor() {
    this.state = { kind: 'waiting' };
    makeAutoObservable(this);
  }

  get title(): Maybe<string> {
    switch (this.state.kind) {
      case 'error':
      case 'loading':
      case 'waiting':
        return nothing();
      case 'ready':
      case 'updating':
        return just(this.state.resource.payload.title);
    }
  }

  get content(): Maybe<string> {
    switch (this.state.kind) {
      case 'error':
      case 'loading':
      case 'waiting':
        return nothing();
      case 'ready':
      case 'updating':
        return just(this.state.resource.payload.content);
    }
  }

  get updateLink(): Maybe<Link<'update'>> {
    switch (this.state.kind) {
      case 'error':
      case 'loading':
      case 'waiting':
        return nothing();
      case 'ready':
      case 'updating':
        return fromNullable(this.state.resource.links.find(isUpdateLink));
    }
  }

  get isUpdatable(): boolean {
    switch (this.state.kind) {
      case 'error':
      case 'loading':
      case 'waiting':
      case 'updating':
        return false;
      case 'ready':
        return this.updateLink.isJust();
    }
  }

  updating = (): void => {
    switch (this.state.kind) {
      case 'error':
      case 'loading':
      case 'waiting':
      case 'updating':
        return;
      case 'ready':
        this.state = { kind: 'updating', resource: this.state.resource };
        setTimeout(() => {
          const time = Date.now();
          this.ready({
            payload: { title: 'Updated', content: `Updated: ${time}` },
            links: [
              { rel: 'update', href: '/api/card/1', method: 'put', type: 'application/json' },
            ],
          });
        }, 5000);
        break;
      default:
        return assertNever(this.state);
    }
  };

  load = (): void => {
    switch (this.state.kind) {
      case 'error':
      case 'loading':
      case 'updating':
      case 'ready':
        return;
      case 'waiting':
        this.state = { kind: 'loading' };
        setTimeout(() => {
          this.ready({
            payload: { title: 'This is a title', content: 'Generate lorem ipsum' },
            links: [
              { rel: 'update', href: '/api/card/1', method: 'put', type: 'application/json' },
            ],
          });
          console.log('ready', toJS(this.state));
        }, 5000);
        break;
      default:
        return assertNever(this.state);
    }
  };

  ready = (resource: CardResource): void => {
    switch (this.state.kind) {
      case 'waiting':
      case 'error':
      case 'ready':
        return;
      case 'loading':
      case 'updating':
        this.state = { kind: 'ready', resource };
        break;
      default:
        return assertNever(this.state);
    }
  };
}

const cardStore = new CardStore();

export default cardStore;
