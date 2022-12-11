import { BaseService } from "@401_digital/xrm-core";
import { UsersEntity } from "src/app/users/users.entity";
import { getManager, getRepository } from "typeorm";

export class CoreService extends BaseService {
    private getFlatChildList(arr = [], user: UsersEntity) {
        user.reporters.forEach(el => {
            arr.push(el.id);
            if (el.reporters.length) {
                this.getFlatChildList(arr, el);
            }
        });
        return arr;
    }

    public async privateGetAllReporters(userId: string) {
        const userEntity = await getRepository(UsersEntity).findOne({ id: userId });
        const reporters = await getManager().getTreeRepository(UsersEntity).findDescendantsTree(userEntity)
        return this.getFlatChildList([], reporters);
    }
}