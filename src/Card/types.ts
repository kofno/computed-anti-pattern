import { Link, Resource } from '@execonline-inc/resource';

interface Payload {
  title: string;
  content: string;
}

type Rel = 'self' | 'update';

export type CardResource = Resource<Payload, Rel>;

interface Waiting {
  kind: 'waiting';
}

export const waiting = (): Waiting => ({ kind: 'waiting' });

interface Loading {
  kind: 'loading';
}

export const loading = (_: Waiting): Loading => ({ kind: 'loading' });

interface Ready {
  kind: 'ready';
  resource: CardResource;
}

export const ready = (_: Loading, resource: CardResource): Ready => ({
  kind: 'ready',
  resource,
});

interface Updating {
  kind: 'updating';
  resource: CardResource;
}

export const updating = ({ resource }: Ready): Updating => ({
  kind: 'updating',
  resource,
});

interface Error {
  kind: 'error';
  message: string;
}

export const error = (_: Loading, message: string): Error => ({
  kind: 'error',
  message,
});

export type State = Waiting | Loading | Ready | Updating | Error;

export function isUpdateLink(link: Link<Rel>): link is Link<'update'> {
  return link.rel === 'update';
}
