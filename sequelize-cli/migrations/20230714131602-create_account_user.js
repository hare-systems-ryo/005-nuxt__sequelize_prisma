/* eslint-disable */
const { DataTypes, QueryTypes } = require('sequelize');
const ComFunc = require('../com-func');
//--------------------------------------
const tableName = 'account_user';
const tableComments = 'アカウント:ユーザー';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const con = ComFunc.GetConnection(queryInterface);
    const columns = {
      // ----------------------------------------------------------------------------
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'ID',
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'UUID:認証システム由来のUUID',
      },
      account_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'アカウントタイプ 9:管理者 1:ユーザー 2:ゲスト',
      },
      account_mail: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'アカウントメール',
      },
      account_state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'アカウント状態フラグ 1:招待中 2:参加中 3:削除',
      },
      // ----------------------------------------------------------------------------
      user_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'ユーザー名',
      },
      user_logo_key: {
        comment: 'ロゴ画像:参照用Key',
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: null,
      },
      // ----------------------------------------------------------------------------
      activate: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment: '削除時ユニーク制御フラグ',
      },
      deleted_at: {
        type: DataTypes.DATE(3), //ミリ秒
        allowNull: true,
        defaultValue: null,
        comment: '削除日時',
      },
      // ----------------------------------------------------------------------------
      created_at: {
        type: DataTypes.DATE(3),
        allowNull: false,
        comment: '生成日時',
      },
      updated_at: {
        type: DataTypes.DATE(3),
        allowNull: false,
        comment: '更新日時',
      },
      // updated_user_id: {
      //   comment: '更新者ID',
      //   allowNull: false,
      //   type: DataTypes.INTEGER,
      // },
    };
    await queryInterface.createTable(tableName, columns, {
      comment: tableComments,
      collate: 'utf8mb4_general_ci',
    });

    await ComFunc.IndexKey.Add(queryInterface, tableName, [
      //
      ['user_name'],
      ['account_type'],
      ['account_state'],
    ]);

    await ComFunc.UniqueKey.Add(queryInterface, tableName, [
      //
      ['uuid'],
      ['account_mail', 'activate'],
    ]);

    // const sql = 'ALTER TABLE `' + tableName + '` auto_increment = 1';
    await con.query(`alter table ${tableName}  enable row level security`, { raw: false });
    const sql = `
        
    create policy "Public profiles are viewable by everyone." on ${tableName}
      for select using (true);
    create policy "Users can insert their own profile." on ${tableName}
      for insert with check (auth.uid() = uuid);
    create policy "Users can update own profile." on ${tableName}
      for update using (auth.uid() = uuid);
    
    CREATE  FUNCTION public.handle_new_user()
      RETURNS trigger as $$
      begin
        insert into public.${tableName} 
        (uuid, account_type,account_mail,account_state,user_name,created_at,updated_at)
        values
        (new.id,2, new.email,2, new.email,new.created_at,new.updated_at);
        return new;
      end;
      $$ language plpgsql security definer;
      create trigger on_auth_user_created
        after insert on auth.users
        for each row execute procedure public.handle_new_user();
    CREATE  FUNCTION public.handle_update_user()
      RETURNS trigger AS $$
        begin
          update public.${tableName} set
            account_mail = new.email,
            updated_at = new.updated_at
            where uuid = new.id;
          return new;
        end;
    $$ language plpgsql security definer;
    CREATE TRIGGER on_auth_user_updated
      AFTER UPDATE OF email on auth.users
      FOR EACH ROW EXECUTE PROCEDURE  public.handle_update_user();
    `;
    await con.query(sql, { raw: false });
  },
  async down(queryInterface, Sequelize) {
    const con = ComFunc.GetConnection(queryInterface);
    await con.query(`DROP trigger on_auth_user_created on auth.users`, { raw: false });
    await con.query(`DROP function public.handle_new_user`, { raw: false });
    await con.query(`DROP trigger on_auth_user_updated on auth.users`, { raw: false });
    await con.query(`DROP function public.handle_update_user`, { raw: false });
    await queryInterface.dropTable(tableName);
    // SupabaseのAuthユーザーも全削除で初期化
    const supabaseClient = ComFunc.GetSupabaseClient();
    if (supabaseClient !== null) {
      await supabaseClient.auth.admin.listUsers().then(async (res) => {
        await Promise.all(res.data.users.map((user) => supabaseClient.auth.admin.deleteUser(user.id)));
      });
    } else {
      console.log('supabaseClientの生成に失敗しました');
    }
  },
};
