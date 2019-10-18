import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Resource } from "./resource";

@Injectable()
export class HalInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next
			.handle()
			.pipe(tap(this.handleResponse));
	}

	private handleResponse(object: any) {
		if (!(object instanceof Resource))
			return object;

		return object.toJSON();
	}
}
