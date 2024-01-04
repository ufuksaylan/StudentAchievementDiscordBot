import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import * as schema from './schema';
import { jsonRoute } from '@/utils/middleware';
import type { Database } from '@/database';
import NotFound from '@/utils/errors/NotFound';

export default (db: Database) => {
  const router = Router();
  const sprints = buildRepository(db);

  router
    .route('/')
    .get(jsonRoute(sprints.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return sprints.create(body);
      }, StatusCodes.CREATED)
    );

  router
    .route('/:id')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await sprints.findById(id);

        if (!record) {
          throw new NotFound('Sprints not found');
        }

        return record;
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const bodyPatch = schema.parseUpdatable(req.body);
        const record = await sprints.update(id, bodyPatch);

        if (!record) {
          throw new NotFound('Sprints not found');
        }

        return record;
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await sprints.remove(id);

        if (!record) {
          throw new NotFound('Sprints not found');
        }
        return record;
      }, StatusCodes.NO_CONTENT)
    )
    .put(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const body = schema.parse(req.body);
        const record = await sprints.findById(id);

        if (!record) {
          return sprints.create(body);
        }

        return sprints.update(id, body);
      })
    );
  return router;
};
