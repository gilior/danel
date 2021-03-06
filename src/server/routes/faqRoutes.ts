



import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as core from "express-serve-static-core";
import { SupportIssue } from "../../models";
import { FaqRoutesHandler } from "../routesLogic/faqRoutesLogic";

let faqRoutesHandler: FaqRoutesHandler = new FaqRoutesHandler();
let faqs: Array<SupportIssue> = new Array<SupportIssue>();
for (var index = 0; index < 20; index++) {
    faqs.push({ prb: `prb ${index}`, sln: `sln ${index}`, id: index })
}

export const faqRouter: core.Router = express.Router();
faqRouter.use('/:faqId', (req: core.Request, res: core.Response, next: core.NextFunction) => {
    console.log(req.query.sln);

    req['faq'] = faqs.find(i => (req.params.faqId == null || i.id == req.params.faqId)
        && (req.query.sln == null || i.sln == req.query.sln));

    if (req['faq'] == null) res.send(404, 'no sux faq');
    else next();
})

//http://localhost:3000/api/faq (w/out body) 
faqRouter.route('/')
    .get((req: core.Request, res: core.Response) => {



        let sorted = faqs.sort((a, b) => { return a.id - b.id });
        let linkedFaqs = [];
        faqRoutesHandler.getAllHandler(faqs, linkedFaqs, req);
        res.json(linkedFaqs);
    })
    .post((req: core.Request, res: core.Response) => {

        faqs.push(req.body);
        res.send(201, req.body);
    }
    )



//http://localhost:3000/api/faq/0[1,2,3,4)
faqRouter.route('/:faqID')
    .get((req: core.Request, res: core.Response) => {
        let linkedFaq = {};
        faqRoutesHandler.getOneHandler(req['faq'], linkedFaq, req)
        res.json(linkedFaq);
    })
    .put((req: core.Request, res: core.Response) => {
        faqRoutesHandler.putHandler(req);
        res.send(200, req.body);
    }
    )
    .patch((req: core.Request, res: core.Response) => {
        faqRoutesHandler.patchHandler(req);
        res.send(200, req.body);
    }
    )

    .delete((req: core.Request, res: core.Response) => {
        faqRoutesHandler.delHandler(req, faqs);
        res.send(204, req['faq']);
    }
    );





